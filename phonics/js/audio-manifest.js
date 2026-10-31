// เสียงคนจริงจาก Wikimedia Commons — สร้างโดย tools/fetch_commons_audio.py (อย่าแก้ด้วยมือ)
// key: "sound:<grapheme>" = เสียงเดี่ยว, "word:<word>" = คำ
const AUDIO_FILES = {
  "sound:a": "audio/sound-a.mp3",
  "sound:ar": "audio/sound-ar.mp3",
  "sound:b": "audio/sound-b.mp3",
  "sound:c": "audio/sound-c.mp3",
  "sound:ch": "audio/sound-ch.mp3",
  "sound:ck": "audio/sound-ck.mp3",
  "sound:d": "audio/sound-d.mp3",
  "sound:e": "audio/sound-e.mp3",
  "sound:ee": "audio/sound-ee.mp3",
  "sound:er": "audio/sound-er.mp3",
  "sound:f": "audio/sound-f.mp3",
  "sound:g": "audio/sound-g.mp3",
  "sound:h": "audio/sound-h.mp3",
  "sound:i": "audio/sound-i.mp3",
  "sound:j": "audio/sound-j.mp3",
  "sound:k": "audio/sound-k.mp3",
  "sound:l": "audio/sound-l.mp3",
  "sound:m": "audio/sound-m.mp3",
  "sound:n": "audio/sound-n.mp3",
  "sound:ng": "audio/sound-ng.mp3",
  "sound:o": "audio/sound-o.mp3",
  "sound:oo": "audio/sound-oo.mp3",
  "sound:or": "audio/sound-or.mp3",
  "sound:p": "audio/sound-p.mp3",
  "sound:r": "audio/sound-r.mp3",
  "sound:s": "audio/sound-s.mp3",
  "sound:sh": "audio/sound-sh.mp3",
  "sound:t": "audio/sound-t.mp3",
  "sound:th": "audio/sound-th.mp3",
  "sound:u": "audio/sound-u.mp3",
  "sound:v": "audio/sound-v.mp3",
  "sound:w": "audio/sound-w.mp3",
  "sound:y": "audio/sound-y.mp3",
  "sound:z": "audio/sound-z.mp3",
  "word:ant": "audio/word-ant.mp3",
  "word:apple": "audio/word-apple.mp3",
  "word:back": "audio/word-back.mp3",
  "word:bad": "audio/word-bad.mp3",
  "word:bag": "audio/word-bag.mp3",
  "word:ball": "audio/word-ball.mp3",
  "word:ban": "audio/word-ban.mp3",
  "word:bat": "audio/word-bat.mp3",
  "word:bath": "audio/word-bath.mp3",
  "word:bed": "audio/word-bed.mp3",
  "word:bee": "audio/word-bee.mp3",
  "word:best": "audio/word-best.mp3",
  "word:bet": "audio/word-bet.mp3",
  "word:boat": "audio/word-boat.mp3",
  "word:boil": "audio/word-boil.mp3",
  "word:book": "audio/word-book.mp3",
  "word:box": "audio/word-box.mp3",
  "word:bus": "audio/word-bus.mp3",
  "word:cake": "audio/word-cake.mp3",
  "word:cap": "audio/word-cap.mp3",
  "word:car": "audio/word-car.mp3",
  "word:cat": "audio/word-cat.mp3",
  "word:cheap": "audio/word-cheap.mp3",
  "word:cheese": "audio/word-cheese.mp3",
  "word:chew": "audio/word-chew.mp3",
  "word:chick": "audio/word-chick.mp3",
  "word:chip": "audio/word-chip.mp3",
  "word:clock": "audio/word-clock.mp3",
  "word:coat": "audio/word-coat.mp3",
  "word:coin": "audio/word-coin.mp3",
  "word:corn": "audio/word-corn.mp3",
  "word:cow": "audio/word-cow.mp3",
  "word:cup": "audio/word-cup.mp3",
  "word:dog": "audio/word-dog.mp3",
  "word:drum": "audio/word-drum.mp3",
  "word:duck": "audio/word-duck.mp3",
  "word:egg": "audio/word-egg.mp3",
  "word:fan": "audio/word-fan.mp3",
  "word:feet": "audio/word-feet.mp3",
  "word:fish": "audio/word-fish.mp3",
  "word:fit": "audio/word-fit.mp3",
  "word:fork": "audio/word-fork.mp3",
  "word:fox": "audio/word-fox.mp3",
  "word:frog": "audio/word-frog.mp3",
  "word:gift": "audio/word-gift.mp3",
  "word:goat": "audio/word-goat.mp3",
  "word:hat": "audio/word-hat.mp3",
  "word:hen": "audio/word-hen.mp3",
  "word:her": "audio/word-her.mp3",
  "word:high": "audio/word-high.mp3",
  "word:horse": "audio/word-horse.mp3",
  "word:igloo": "audio/word-igloo.mp3",
  "word:ink": "audio/word-ink.mp3",
  "word:insect": "audio/word-insect.mp3",
  "word:jam": "audio/word-jam.mp3",
  "word:jet": "audio/word-jet.mp3",
  "word:jug": "audio/word-jug.mp3",
  "word:kid": "audio/word-kid.mp3",
  "word:king": "audio/word-king.mp3",
  "word:kite": "audio/word-kite.mp3",
  "word:leg": "audio/word-leg.mp3",
  "word:lemon": "audio/word-lemon.mp3",
  "word:letter": "audio/word-letter.mp3",
  "word:lice": "audio/word-lice.mp3",
  "word:light": "audio/word-light.mp3",
  "word:lion": "audio/word-lion.mp3",
  "word:lock": "audio/word-lock.mp3",
  "word:man": "audio/word-man.mp3",
  "word:map": "audio/word-map.mp3",
  "word:men": "audio/word-men.mp3",
  "word:milk": "audio/word-milk.mp3",
  "word:moon": "audio/word-moon.mp3",
  "word:mouse": "audio/word-mouse.mp3",
  "word:mouth": "audio/word-mouth.mp3",
  "word:net": "audio/word-net.mp3",
  "word:night": "audio/word-night.mp3",
  "word:nose": "audio/word-nose.mp3",
  "word:nut": "audio/word-nut.mp3",
  "word:octopus": "audio/word-octopus.mp3",
  "word:oil": "audio/word-oil.mp3",
  "word:owl": "audio/word-owl.mp3",
  "word:pan": "audio/word-pan.mp3",
  "word:pen": "audio/word-pen.mp3",
  "word:pig": "audio/word-pig.mp3",
  "word:pin": "audio/word-pin.mp3",
  "word:queen": "audio/word-queen.mp3",
  "word:quilt": "audio/word-quilt.mp3",
  "word:quiz": "audio/word-quiz.mp3",
  "word:rabbit": "audio/word-rabbit.mp3",
  "word:rain": "audio/word-rain.mp3",
  "word:red": "audio/word-red.mp3",
  "word:rice": "audio/word-rice.mp3",
  "word:right": "audio/word-right.mp3",
  "word:ring": "audio/word-ring.mp3",
  "word:rise": "audio/word-rise.mp3",
  "word:rock": "audio/word-rock.mp3",
  "word:sat": "audio/word-sat.mp3",
  "word:seat": "audio/word-seat.mp3",
  "word:shark": "audio/word-shark.mp3",
  "word:sheep": "audio/word-sheep.mp3",
  "word:shell": "audio/word-shell.mp3",
  "word:ship": "audio/word-ship.mp3",
  "word:shoe": "audio/word-shoe.mp3",
  "word:sick": "audio/word-sick.mp3",
  "word:sink": "audio/word-sink.mp3",
  "word:sip": "audio/word-sip.mp3",
  "word:sit": "audio/word-sit.mp3",
  "word:six": "audio/word-six.mp3",
  "word:snail": "audio/word-snail.mp3",
  "word:sock": "audio/word-sock.mp3",
  "word:star": "audio/word-star.mp3",
  "word:sue": "audio/word-sue.mp3",
  "word:sun": "audio/word-sun.mp3",
  "word:swing": "audio/word-swing.mp3",
  "word:tap": "audio/word-tap.mp3",
  "word:ten": "audio/word-ten.mp3",
  "word:tent": "audio/word-tent.mp3",
  "word:thick": "audio/word-thick.mp3",
  "word:thin": "audio/word-thin.mp3",
  "word:think": "audio/word-think.mp3",
  "word:three": "audio/word-three.mp3",
  "word:thumb": "audio/word-thumb.mp3",
  "word:tiger": "audio/word-tiger.mp3",
  "word:tin": "audio/word-tin.mp3",
  "word:town": "audio/word-town.mp3",
  "word:train": "audio/word-train.mp3",
  "word:tree": "audio/word-tree.mp3",
  "word:umbrella": "audio/word-umbrella.mp3",
  "word:van": "audio/word-van.mp3",
  "word:vest": "audio/word-vest.mp3",
  "word:vet": "audio/word-vet.mp3",
  "word:violin": "audio/word-violin.mp3",
  "word:watch": "audio/word-watch.mp3",
  "word:web": "audio/word-web.mp3",
  "word:west": "audio/word-west.mp3",
  "word:wet": "audio/word-wet.mp3",
  "word:wig": "audio/word-wig.mp3",
  "word:yak": "audio/word-yak.mp3",
  "word:yellow": "audio/word-yellow.mp3",
  "word:yo-yo": "audio/word-yo-yo.mp3",
  "word:zebra": "audio/word-zebra.mp3",
  "word:zip": "audio/word-zip.mp3",
  "word:zoo": "audio/word-zoo.mp3"
};

// ที่มาและสัญญาอนุญาตของทุกไฟล์
const AUDIO_CREDITS = [
  {
    "key": "sound:s",
    "title": "Voiceless alveolar sibilant.ogg",
    "author": "Peter Isotalo",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_alveolar_sibilant.ogg"
  },
  {
    "key": "sound:z",
    "title": "Voiced alveolar sibilant.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiced_alveolar_sibilant.ogg"
  },
  {
    "key": "sound:sh",
    "title": "Voiceless palato-alveolar sibilant.ogg",
    "author": "Peter Isotalo",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_palato-alveolar_sibilant.ogg"
  },
  {
    "key": "sound:ch",
    "title": "Voiceless palato-alveolar affricate.ogg",
    "author": "Peter Isotalo",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_palato-alveolar_affricate.ogg"
  },
  {
    "key": "sound:j",
    "title": "Voiced palato-alveolar affricate.ogg",
    "author": "The original uploader was Octane at English Wikipedia.",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:Voiced_palato-alveolar_affricate.ogg"
  },
  {
    "key": "sound:th",
    "title": "Voiceless dental fricative.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_dental_fricative.ogg"
  },
  {
    "key": "sound:f",
    "title": "Voiceless labiodental fricative.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_labiodental_fricative.ogg"
  },
  {
    "key": "sound:v",
    "title": "Voiced labiodental fricative.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiced_labiodental_fricative.ogg"
  },
  {
    "key": "sound:h",
    "title": "Voiceless glottal fricative.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_glottal_fricative.ogg"
  },
  {
    "key": "sound:m",
    "title": "Bilabial nasal.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Bilabial_nasal.ogg"
  },
  {
    "key": "sound:n",
    "title": "Alveolar nasal.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Alveolar_nasal.ogg"
  },
  {
    "key": "sound:ng",
    "title": "Velar nasal.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Velar_nasal.ogg"
  },
  {
    "key": "sound:l",
    "title": "Alveolar lateral approximant.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Alveolar_lateral_approximant.ogg"
  },
  {
    "key": "sound:r",
    "title": "Alveolar approximant.ogg",
    "author": "Erutuon",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Alveolar_approximant.ogg"
  },
  {
    "key": "sound:w",
    "title": "Voiced labio-velar approximant.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiced_labio-velar_approximant.ogg"
  },
  {
    "key": "sound:y",
    "title": "Palatal approximant.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Palatal_approximant.ogg"
  },
  {
    "key": "sound:p",
    "title": "Voiceless bilabial plosive.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_bilabial_plosive.ogg"
  },
  {
    "key": "sound:b",
    "title": "Voiced bilabial plosive.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiced_bilabial_plosive.ogg"
  },
  {
    "key": "sound:t",
    "title": "Voiceless alveolar plosive.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_alveolar_plosive.ogg"
  },
  {
    "key": "sound:d",
    "title": "Voiced alveolar plosive.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiced_alveolar_plosive.ogg"
  },
  {
    "key": "sound:c",
    "title": "Voiceless velar plosive.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_velar_plosive.ogg"
  },
  {
    "key": "sound:k",
    "title": "Voiceless velar plosive.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_velar_plosive.ogg"
  },
  {
    "key": "sound:ck",
    "title": "Voiceless velar plosive.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiceless_velar_plosive.ogg"
  },
  {
    "key": "sound:g",
    "title": "Voiced velar plosive 02.ogg",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Voiced_velar_plosive_02.ogg"
  },
  {
    "key": "sound:a",
    "title": "Near-open front unrounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Near-open_front_unrounded_vowel.ogg"
  },
  {
    "key": "sound:e",
    "title": "Open-mid front unrounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Open-mid_front_unrounded_vowel.ogg"
  },
  {
    "key": "sound:i",
    "title": "Near-close near-front unrounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Near-close_near-front_unrounded_vowel.ogg"
  },
  {
    "key": "sound:o",
    "title": "Open back rounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Open_back_rounded_vowel.ogg"
  },
  {
    "key": "sound:u",
    "title": "Open-mid back unrounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Open-mid_back_unrounded_vowel.ogg"
  },
  {
    "key": "sound:ee",
    "title": "Close front unrounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Close_front_unrounded_vowel.ogg"
  },
  {
    "key": "sound:oo",
    "title": "Close back rounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Close_back_rounded_vowel.ogg"
  },
  {
    "key": "sound:ar",
    "title": "Open back unrounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Open_back_unrounded_vowel.ogg"
  },
  {
    "key": "sound:or",
    "title": "Open-mid back rounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Open-mid_back_rounded_vowel.ogg"
  },
  {
    "key": "sound:er",
    "title": "Open-mid central unrounded vowel.ogg",
    "author": "No machine-readable author provided. Denelson83 assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Open-mid_central_unrounded_vowel.ogg"
  },
  {
    "key": "word:ant",
    "title": "En-us-ant.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-ant.ogg"
  },
  {
    "key": "word:apple",
    "title": "En-uk-apple.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-apple.ogg"
  },
  {
    "key": "word:back",
    "title": "En-us-back.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-back.ogg"
  },
  {
    "key": "word:bad",
    "title": "En-uk-bad.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-bad.ogg"
  },
  {
    "key": "word:bag",
    "title": "En-us-bag.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-bag.ogg"
  },
  {
    "key": "word:ball",
    "title": "En-us-ball.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-ball.ogg"
  },
  {
    "key": "word:ban",
    "title": "LL-Q1860 (eng)-Fake estate-ban.wav",
    "author": "Speaker: Fake estate\nRecorder: Fake estate",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1860_(eng)-Fake_estate-ban.wav"
  },
  {
    "key": "word:bat",
    "title": "En-us-bat.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-bat.ogg"
  },
  {
    "key": "word:bath",
    "title": "En-us-bath.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-bath.ogg"
  },
  {
    "key": "word:bed",
    "title": "En-uk-bed.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-bed.ogg"
  },
  {
    "key": "word:bee",
    "title": "En-us-bee.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-bee.ogg"
  },
  {
    "key": "word:best",
    "title": "En-us-best.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-best.ogg"
  },
  {
    "key": "word:bet",
    "title": "En-us-bet.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-bet.ogg"
  },
  {
    "key": "word:boat",
    "title": "En-us-boat.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-boat.ogg"
  },
  {
    "key": "word:boil",
    "title": "LL-Q1860 (eng)-Simplificationalizer-boil.wav",
    "author": "Speaker: Simplificationalizer\nRecorder: Simplificationalizer",
    "license": "CC0",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1860_(eng)-Simplificationalizer-boil.wav"
  },
  {
    "key": "word:book",
    "title": "En-uk-book.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-book.ogg"
  },
  {
    "key": "word:box",
    "title": "En-us-box.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-box.ogg"
  },
  {
    "key": "word:bus",
    "title": "En-us-bus.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-bus.ogg"
  },
  {
    "key": "word:cake",
    "title": "En-uk-cake.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-cake.ogg"
  },
  {
    "key": "word:cap",
    "title": "En-us-cap.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-cap.ogg"
  },
  {
    "key": "word:car",
    "title": "En-us-car.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-car.ogg"
  },
  {
    "key": "word:cat",
    "title": "En-us-cat.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-cat.ogg"
  },
  {
    "key": "word:cheap",
    "title": "En-uk-cheap.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-cheap.ogg"
  },
  {
    "key": "word:cheese",
    "title": "En-uk-cheese.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-cheese.ogg"
  },
  {
    "key": "word:chew",
    "title": "En-us-chew.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-chew.ogg"
  },
  {
    "key": "word:chick",
    "title": "En-us-chick.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-chick.ogg"
  },
  {
    "key": "word:chip",
    "title": "En-us-chip.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-chip.ogg"
  },
  {
    "key": "word:clock",
    "title": "En-uk-clock.ogg",
    "author": "ATMarsden",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-clock.ogg"
  },
  {
    "key": "word:coat",
    "title": "En-uk-coat.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-coat.ogg"
  },
  {
    "key": "word:coin",
    "title": "En-us-coin.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-coin.ogg"
  },
  {
    "key": "word:corn",
    "title": "En-uk-corn.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-corn.ogg"
  },
  {
    "key": "word:cow",
    "title": "En-us-cow.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-cow.ogg"
  },
  {
    "key": "word:cup",
    "title": "En-us-cup.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-cup.ogg"
  },
  {
    "key": "word:dog",
    "title": "En-uk-dog.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-dog.ogg"
  },
  {
    "key": "word:drum",
    "title": "En-us-drum.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-drum.ogg"
  },
  {
    "key": "word:duck",
    "title": "En-us-duck.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-duck.ogg"
  },
  {
    "key": "word:egg",
    "title": "En-uk-egg.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-egg.ogg"
  },
  {
    "key": "word:fan",
    "title": "LL-Q1860 (eng)-Vealhurl-fan.wav",
    "author": "Speaker: Vealhurl\nRecorder: Vealhurl",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1860_(eng)-Vealhurl-fan.wav"
  },
  {
    "key": "word:feet",
    "title": "En-us-feet.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-feet.ogg"
  },
  {
    "key": "word:fish",
    "title": "En-uk-fish.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-fish.ogg"
  },
  {
    "key": "word:fit",
    "title": "En-us-fit.ogg",
    "author": "Dvortygirl",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-fit.ogg"
  },
  {
    "key": "word:fork",
    "title": "En-us-fork.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-fork.ogg"
  },
  {
    "key": "word:fox",
    "title": "En-us-fox.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-fox.ogg"
  },
  {
    "key": "word:frog",
    "title": "En-us-frog.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-frog.ogg"
  },
  {
    "key": "word:gift",
    "title": "En-us-gift.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-gift.ogg"
  },
  {
    "key": "word:goat",
    "title": "En-us-goat.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-goat.ogg"
  },
  {
    "key": "word:hat",
    "title": "En-uk-hat.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-hat.ogg"
  },
  {
    "key": "word:hen",
    "title": "En-us-hen.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-hen.ogg"
  },
  {
    "key": "word:her",
    "title": "En-us-her.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-her.ogg"
  },
  {
    "key": "word:high",
    "title": "En-uk-high.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-high.ogg"
  },
  {
    "key": "word:horse",
    "title": "En-us-horse.ogg",
    "author": "No machine-readable author provided. Dvortygirl assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-horse.ogg"
  },
  {
    "key": "word:igloo",
    "title": "LL-Q1860 (eng)-Vealhurl-igloo.wav",
    "author": "Speaker: Vealhurl\nRecorder: Vealhurl",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1860_(eng)-Vealhurl-igloo.wav"
  },
  {
    "key": "word:ink",
    "title": "En-us-ink.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-ink.ogg"
  },
  {
    "key": "word:insect",
    "title": "En-us-insect.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-insect.ogg"
  },
  {
    "key": "word:jam",
    "title": "En-uk-jam.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-jam.ogg"
  },
  {
    "key": "word:jet",
    "title": "En-au-jet.ogg",
    "author": "Commander Keane",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-au-jet.ogg"
  },
  {
    "key": "word:jug",
    "title": "En-au-jug.ogg",
    "author": "Commander Keane",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-au-jug.ogg"
  },
  {
    "key": "word:kid",
    "title": "En-us-kid.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-kid.ogg"
  },
  {
    "key": "word:king",
    "title": "En-us-king.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-king.ogg"
  },
  {
    "key": "word:kite",
    "title": "En-us-kite.ogg",
    "author": "Mx. Granger",
    "license": "CC0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-kite.ogg"
  },
  {
    "key": "word:leg",
    "title": "En-uk-leg.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-leg.ogg"
  },
  {
    "key": "word:lemon",
    "title": "En-uk-lemon.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-lemon.ogg"
  },
  {
    "key": "word:letter",
    "title": "En-uk-letter.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-letter.ogg"
  },
  {
    "key": "word:lice",
    "title": "LL-Q1860 (eng)-Vealhurl-lice.wav",
    "author": "Speaker: Vealhurl\nRecorder: Vealhurl",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1860_(eng)-Vealhurl-lice.wav"
  },
  {
    "key": "word:light",
    "title": "En-uk-light.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-light.ogg"
  },
  {
    "key": "word:lion",
    "title": "En-us-lion.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-lion.ogg"
  },
  {
    "key": "word:lock",
    "title": "En-us-lock.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-lock.ogg"
  },
  {
    "key": "word:man",
    "title": "En-uk-man.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-man.ogg"
  },
  {
    "key": "word:map",
    "title": "En-us-map.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-map.ogg"
  },
  {
    "key": "word:men",
    "title": "En-us-men.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-men.ogg"
  },
  {
    "key": "word:milk",
    "title": "En-uk-milk.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-milk.ogg"
  },
  {
    "key": "word:moon",
    "title": "En-uk-moon.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-moon.ogg"
  },
  {
    "key": "word:mouse",
    "title": "En-us-mouse.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-mouse.ogg"
  },
  {
    "key": "word:mouth",
    "title": "En-uk-mouth.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-mouth.ogg"
  },
  {
    "key": "word:net",
    "title": "En-us-net.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-net.ogg"
  },
  {
    "key": "word:night",
    "title": "En-us-night.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-night.ogg"
  },
  {
    "key": "word:nose",
    "title": "En-uk-nose.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-nose.ogg"
  },
  {
    "key": "word:nut",
    "title": "En-us-nut.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-nut.ogg"
  },
  {
    "key": "word:octopus",
    "title": "En-us-octopus.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-octopus.ogg"
  },
  {
    "key": "word:oil",
    "title": "En-uk-oil.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-oil.ogg"
  },
  {
    "key": "word:owl",
    "title": "En-us-owl.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-owl.ogg"
  },
  {
    "key": "word:pan",
    "title": "En-us-pan.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-pan.ogg"
  },
  {
    "key": "word:pen",
    "title": "En-us-pen.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-pen.ogg"
  },
  {
    "key": "word:pig",
    "title": "En-us-pig.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-pig.ogg"
  },
  {
    "key": "word:pin",
    "title": "En-us-pin.ogg",
    "author": "Unknown",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-pin.ogg"
  },
  {
    "key": "word:queen",
    "title": "En-us-queen.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-queen.ogg"
  },
  {
    "key": "word:quilt",
    "title": "En-us-quilt.ogg",
    "author": "Sylvanmoon",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-quilt.ogg"
  },
  {
    "key": "word:quiz",
    "title": "En-us-quiz.ogg",
    "author": "Sylvanmoon",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-quiz.ogg"
  },
  {
    "key": "word:rabbit",
    "title": "En-us-rabbit.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-rabbit.ogg"
  },
  {
    "key": "word:rain",
    "title": "En-uk-rain.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-rain.ogg"
  },
  {
    "key": "word:red",
    "title": "En-uk-red.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-red.ogg"
  },
  {
    "key": "word:rice",
    "title": "En-uk-rice.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-rice.ogg"
  },
  {
    "key": "word:right",
    "title": "En-uk-right.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-right.ogg"
  },
  {
    "key": "word:ring",
    "title": "En-us-ring.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-ring.ogg"
  },
  {
    "key": "word:rise",
    "title": "En-us-rise.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-rise.ogg"
  },
  {
    "key": "word:rock",
    "title": "En-us-rock.ogg",
    "author": "No machine-readable author provided. Dvortygirl assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-rock.ogg"
  },
  {
    "key": "word:sat",
    "title": "En-us-sat.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-sat.ogg"
  },
  {
    "key": "word:seat",
    "title": "En-us-seat.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-seat.ogg"
  },
  {
    "key": "word:shark",
    "title": "En-us-shark.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-shark.ogg"
  },
  {
    "key": "word:sheep",
    "title": "En-us-sheep.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-sheep.ogg"
  },
  {
    "key": "word:shell",
    "title": "En-us-shell.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-shell.ogg"
  },
  {
    "key": "word:ship",
    "title": "En-us-ship.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-ship.ogg"
  },
  {
    "key": "word:shoe",
    "title": "En-us-shoe.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-shoe.ogg"
  },
  {
    "key": "word:sick",
    "title": "En-uk-sick.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-sick.ogg"
  },
  {
    "key": "word:sink",
    "title": "En-uk-sink.ogg",
    "author": "No machine-readable author provided. Celestianpower assumed (based on copyright claims).",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-sink.ogg"
  },
  {
    "key": "word:sip",
    "title": "LL-Q1860 (eng)-Vealhurl-sip.wav",
    "author": "Speaker: Vealhurl\nRecorder: Vealhurl",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1860_(eng)-Vealhurl-sip.wav"
  },
  {
    "key": "word:sit",
    "title": "En-us-sit.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-sit.ogg"
  },
  {
    "key": "word:six",
    "title": "En-us-six.ogg",
    "author": "No machine-readable author provided. TheDaveRoss assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-six.ogg"
  },
  {
    "key": "word:snail",
    "title": "En-us-snail.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-snail.ogg"
  },
  {
    "key": "word:sock",
    "title": "En-us-sock.ogg",
    "author": "No machine-readable author provided. Dvortygirl assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-sock.ogg"
  },
  {
    "key": "word:star",
    "title": "En-uk-star.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-star.ogg"
  },
  {
    "key": "word:sue",
    "title": "En-us-sue.ogg",
    "author": "Neskaya",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-sue.ogg"
  },
  {
    "key": "word:sun",
    "title": "En-uk-sun.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-sun.ogg"
  },
  {
    "key": "word:swing",
    "title": "En-us-swing.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-swing.ogg"
  },
  {
    "key": "word:tap",
    "title": "En-us-tap.ogg",
    "author": "Dvortygirl",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-tap.ogg"
  },
  {
    "key": "word:ten",
    "title": "En-us-ten.ogg",
    "author": "No machine-readable author provided. TheDaveRoss assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-ten.ogg"
  },
  {
    "key": "word:tent",
    "title": "En-us-tent.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-tent.ogg"
  },
  {
    "key": "word:thick",
    "title": "En-us-thick.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-thick.ogg"
  },
  {
    "key": "word:thin",
    "title": "En-us-thin.ogg",
    "author": "Unknown",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-thin.ogg"
  },
  {
    "key": "word:think",
    "title": "En-us-think.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-think.ogg"
  },
  {
    "key": "word:three",
    "title": "En-us-three.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-three.ogg"
  },
  {
    "key": "word:thumb",
    "title": "En-us-thumb.ogg",
    "author": "Dvortygirl",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-thumb.ogg"
  },
  {
    "key": "word:tiger",
    "title": "En-us-tiger.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-tiger.ogg"
  },
  {
    "key": "word:tin",
    "title": "En-us-tin.ogg",
    "author": "No machine-readable author provided. Dvortygirl assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-tin.ogg"
  },
  {
    "key": "word:town",
    "title": "En-uk-town.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-town.ogg"
  },
  {
    "key": "word:train",
    "title": "En-us-train.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-train.ogg"
  },
  {
    "key": "word:tree",
    "title": "En-uk-tree.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-tree.ogg"
  },
  {
    "key": "word:umbrella",
    "title": "En-us-umbrella.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-umbrella.ogg"
  },
  {
    "key": "word:van",
    "title": "En-us-van.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-van.ogg"
  },
  {
    "key": "word:vest",
    "title": "En-us-vest.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-vest.ogg"
  },
  {
    "key": "word:vet",
    "title": "LL-Q1860 (eng)-Vealhurl-vet.wav",
    "author": "Speaker: Vealhurl\nRecorder: Vealhurl",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1860_(eng)-Vealhurl-vet.wav"
  },
  {
    "key": "word:violin",
    "title": "En-us-violin.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-violin.ogg"
  },
  {
    "key": "word:watch",
    "title": "En-us-watch.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-watch.ogg"
  },
  {
    "key": "word:web",
    "title": "En-us-web.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-web.ogg"
  },
  {
    "key": "word:west",
    "title": "En-uk-west.ogg",
    "author": "Association Shtooka, Judith Franck",
    "license": "CC BY 3.0 us",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-west.ogg"
  },
  {
    "key": "word:wet",
    "title": "En-us-wet.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-wet.ogg"
  },
  {
    "key": "word:wig",
    "title": "En-us-wig.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-wig.ogg"
  },
  {
    "key": "word:yak",
    "title": "En-au-yak.ogg",
    "author": "Commander Keane",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-au-yak.ogg"
  },
  {
    "key": "word:yellow",
    "title": "En-uk-yellow.ogg",
    "author": "Unknown",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-yellow.ogg"
  },
  {
    "key": "word:yo-yo",
    "title": "En-us-yo-yo.ogg",
    "author": "No machine-readable author provided. Dvortygirl assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-yo-yo.ogg"
  },
  {
    "key": "word:zebra",
    "title": "En-uk-zebra.ogg",
    "author": "No machine-readable author provided. Celestianpower assumed (based on copyright claims).",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File:En-uk-zebra.ogg"
  },
  {
    "key": "word:zip",
    "title": "En-us-zip.ogg",
    "author": "Dvortygirl",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-zip.ogg"
  },
  {
    "key": "word:zoo",
    "title": "En-us-zoo.ogg",
    "author": "No machine-readable author provided. Neoglitch assumed (based on copyright claims).",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:En-us-zoo.ogg"
  }
];
