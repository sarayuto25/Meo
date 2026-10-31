#!/usr/bin/env python3
"""Download real human recordings from Wikimedia Commons for Meo Phonics.

- Phonemes: IPA recordings (e.g. "Voiceless alveolar sibilant.ogg")
- Words: Wiktionary pronunciations ("En-us-cat.ogg", "En-uk-cat.ogg") or
  Lingua Libre recordings ("LL-Q1860 (eng)-<speaker>-cat.wav")

Each file is converted to a small mono MP3 in ../audio/ and listed, with its
author and licence, in ../js/audio-manifest.js. Only files whose licence is
CC0 / public domain / CC BY / CC BY-SA are kept.

Usage:  python3 tools/fetch_commons_audio.py [--only-missing]
Needs:  ffmpeg, network access to commons.wikimedia.org and upload.wikimedia.org
"""
import html
import json
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "audio"
MANIFEST = ROOT / "js" / "audio-manifest.js"
API = "https://commons.wikimedia.org/w/api.php"
UA = "MeoPhonicsBot/1.0 (https://github.com/sarayuto25/meo)"
OK_LICENSE = re.compile(r"^(cc0|public domain|pd|cc[- ]by(-sa)?[- ]\d)", re.I)

# Phoneme -> candidate Commons IPA recordings (first one that exists wins)
PHONEMES = {
    "s": ["Voiceless alveolar sibilant.ogg"],
    "z": ["Voiced alveolar sibilant.ogg"],
    "sh": ["Voiceless palato-alveolar sibilant.ogg"],
    "ch": ["Voiceless palato-alveolar affricate.ogg"],
    "j": ["Voiced palato-alveolar affricate.ogg"],
    "th": ["Voiceless dental fricative.ogg"],
    "f": ["Voiceless labiodental fricative.ogg"],
    "v": ["Voiced labiodental fricative.ogg"],
    "h": ["Voiceless glottal fricative.ogg"],
    "m": ["Bilabial nasal.ogg"],
    "n": ["Alveolar nasal.ogg"],
    "ng": ["Velar nasal.ogg"],
    "l": ["Alveolar lateral approximant.ogg"],
    "r": ["Alveolar approximant.ogg"],
    "w": ["Voiced labio-velar approximant.ogg"],
    "y": ["Palatal approximant.ogg"],
    "p": ["Voiceless bilabial plosive.ogg"],
    "b": ["Voiced bilabial plosive.ogg"],
    "t": ["Voiceless alveolar plosive.ogg"],
    "d": ["Voiced alveolar plosive.ogg"],
    "c": ["Voiceless velar plosive.ogg"],
    "k": ["Voiceless velar plosive.ogg"],
    "ck": ["Voiceless velar plosive.ogg"],
    "g": ["Voiced velar plosive 02.ogg", "Voiced velar plosive.ogg"],
    "a": ["Near-open front unrounded vowel.ogg"],
    "e": ["Open-mid front unrounded vowel.ogg"],
    "i": ["Near-close near-front unrounded vowel.ogg"],
    "o": ["Open back rounded vowel.ogg"],
    "u": ["Open-mid back unrounded vowel.ogg"],
    "ee": ["Close front unrounded vowel.ogg"],
    "oo": ["Close back rounded vowel.ogg"],
    "ar": ["Open back unrounded vowel.ogg"],
    "or": ["Open-mid back rounded vowel.ogg"],
    "er": ["Open-mid central unrounded vowel.ogg", "Mid-central vowel.ogg"],
}


def words_from_data():
    """Collect every English word used by the site from js/data.js."""
    src = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
    words = set(re.findall(r'\["([a-z][a-z-]*)",\s*"', src))          # SOUNDS words + TRICKY pairs
    words |= set(re.findall(r'word:\s*"([a-z]+)"', src))               # BLEND_WORDS
    for a, _, b, _ in re.findall(r'\["([a-z]+)", "([^"]*)", "([a-z]+)", "([^"]*)"\]', src):
        words |= {a, b}
    graphemes = set(re.findall(r'\bg:\s*"([a-z]+)"', src))  # drop blend "parts" like "sh"
    return sorted(words - graphemes)


def wait_for(e, attempt):
    """Seconds to wait after an HTTP error: honour Retry-After (capped), else back off."""
    ra = e.headers.get("Retry-After") if isinstance(e, urllib.error.HTTPError) else None
    try:
        return min(int(ra), 300) if ra else 10 * (attempt + 1)
    except ValueError:
        return 10 * (attempt + 1)


def api(params):
    params = {**params, "format": "json", "formatversion": "2", "maxlag": "5"}
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(8):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001
            if attempt == 7:
                raise
            w = wait_for(e, attempt)
            print(f"  api retry in {w}s ({e})", file=sys.stderr, flush=True)
            time.sleep(w)
        finally:
            time.sleep(1)


def strip_html(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def file_info(titles):
    """Return {title: info} for the titles that exist (batched, 50 per call)."""
    out = {}
    titles = list(dict.fromkeys(titles))
    for i in range(0, len(titles), 50):
        batch = titles[i:i + 50]
        data = api({
            "action": "query", "prop": "imageinfo", "iiprop": "url|extmetadata|mime",
            "titles": "|".join("File:" + t for t in batch),
        })
        for page in data.get("query", {}).get("pages", []):
            if page.get("missing") or "imageinfo" not in page:
                continue
            ii = page["imageinfo"][0]
            meta = ii.get("extmetadata", {})
            out[page["title"][5:]] = {
                "url": ii["url"],
                "page": ii.get("descriptionurl", ""),
                "author": strip_html(meta.get("Artist", {}).get("value", "")) or "Unknown",
                "license": strip_html(meta.get("LicenseShortName", {}).get("value", "")),
            }
        time.sleep(0.5)
    return out


def search_lingualibre(word):
    """Find a Lingua Libre English recording of exactly this word."""
    data = api({
        "action": "query", "list": "search", "srnamespace": 6, "srlimit": 20,
        "srsearch": f'intitle:"LL-Q1860 (eng)" intitle:"{word}"',
    })
    pat = re.compile(r"^File:LL-Q1860 \(eng\)-[^-]+-" + re.escape(word) + r"\.wav$", re.I)
    return [h["title"][5:] for h in data.get("query", {}).get("search", []) if pat.match(h["title"])]


def transcoded_mp3(url):
    """Commons serves an MP3 transcode of every audio file; upload.wikimedia.org
    throttles bulk downloads of originals, so prefer the transcode."""
    name = url.rsplit("/", 1)[1]
    return url.replace("/wikipedia/commons/", "/wikipedia/commons/transcoded/", 1) + f"/{name}.mp3"


def fetch_bytes(url):
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404 or attempt == 5:
                raise
            w = wait_for(e, attempt)
            print(f"  download retry in {w}s ({e.code})", file=sys.stderr, flush=True)
            time.sleep(w)


def download_and_convert(url, dest):
    try:
        data, suffix = fetch_bytes(transcoded_mp3(url)), ".mp3"
    except urllib.error.HTTPError:
        data, suffix = fetch_bytes(url), Path(url).suffix
    with tempfile.NamedTemporaryFile(suffix=suffix) as tmp:
        tmp.write(data)
        tmp.flush()
        # mono, trimmed leading/trailing silence, normalised loudness, small MP3
        subprocess.run([
            "ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name,
            "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                   "silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm",
            "-ac", "1", "-ar", "44100", "-b:a", "64k", str(dest),
        ], check=True)
    dur = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dest)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(dur or 0)


def main():
    AUDIO_DIR.mkdir(exist_ok=True)
    files, credits, report = {}, [], []

    def add(key, title, info, fname):
        if not OK_LICENSE.match(info["license"] or ""):
            report.append(f"skip {key}: licence '{info['license']}' ({title})")
            return False
        dest = AUDIO_DIR / fname
        try:
            dur = download_and_convert(info["url"], dest)
        except Exception as e:  # noqa: BLE001
            report.append(f"fail {key}: {e} ({title})")
            return False
        files[key] = f"audio/{fname}"
        credits.append({"key": key, "title": title, "author": info["author"][:120],
                        "license": info["license"], "source": info["page"]})
        report.append(f"ok   {key:<14} {dur:4.1f}s  {info['license']:<14} {title}")
        time.sleep(2)
        return True

    # --- phonemes
    print("Phonemes…")
    info = file_info([t for c in PHONEMES.values() for t in c])
    for g, cands in PHONEMES.items():
        hit = next((t for t in cands if t in info), None)
        if not hit:
            report.append(f"miss sound:{g}")
            continue
        add(f"sound:{g}", hit, info[hit], f"sound-{g}.mp3")

    # --- words
    words = words_from_data()
    print(f"Words ({len(words)})…")
    cands = {w: [f"En-uk-{w}.ogg", f"En-us-{w}.ogg", f"En-au-{w}.ogg"] for w in words}
    info = file_info([t for c in cands.values() for t in c])
    for w in words:
        hit = next((t for t in cands[w] if t in info), None)
        if hit and add(f"word:{w}", hit, info[hit], f"word-{w}.mp3"):
            continue
        ll = search_lingualibre(w)
        if ll:
            li = file_info(ll[:1])
            if ll[0] in li and add(f"word:{w}", ll[0], li[ll[0]], f"word-{w}.mp3"):
                continue
        report.append(f"miss word:{w}")

    js = (
        "// เสียงคนจริงจาก Wikimedia Commons — สร้างโดย tools/fetch_commons_audio.py (อย่าแก้ด้วยมือ)\n"
        "// key: \"sound:<grapheme>\" = เสียงเดี่ยว, \"word:<word>\" = คำ\n"
        f"const AUDIO_FILES = {json.dumps(dict(sorted(files.items())), ensure_ascii=False, indent=2)};\n\n"
        "// ที่มาและสัญญาอนุญาตของทุกไฟล์\n"
        f"const AUDIO_CREDITS = {json.dumps(credits, ensure_ascii=False, indent=2)};\n"
    )
    MANIFEST.write_text(js, encoding="utf-8")
    print("\n".join(report))
    print(f"\n{len(files)} files written to {AUDIO_DIR}")


if __name__ == "__main__":
    main()
