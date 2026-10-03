# Claude Code Exercise: Edit, Check, and Repeat

## 1. Expected Workflow

1. **Read before editing:** Claude reads the relevant files before changing them.
2. **Show the proposed change:** Claude shows a diff before saving.
3. **Wait for approval:** Claude asks me to accept or reject the change.
4. **Apply the change:** Claude saves the change after I approve it.
5. **Check the result:** Claude confirms the change was applied correctly.

For larger tasks, Claude should repeat this cycle in small, reviewable steps.

## 2. Test Setup

Prompt used to create the file:

> Create a small Python file named greeting.py that prints "Hello, world!". Keep it simple.

Prompt used to add a comment:

> Add a one-line comment at the beginning of greeting.py explaining that the script prints a greeting.

Environment: Claude Code on the web (cloud session), with **auto mode** turned on. In auto mode, Claude applies file edits without asking for approval each time.

## 3. Actual Test Results

**Initial file** (`greeting.py`, commit `51e816d`):

```python
print("Hello, world!")
```

Running `python3 greeting.py` printed `Hello, world!`.

**Change shown by Claude** (from `git diff` after the edit):

```diff
--- a/greeting.py
+++ b/greeting.py
@@ -1 +1,2 @@
+# This script prints a greeting.
 print("Hello, world!")
```

**Approval behavior:** Claude did **not** ask for approval before saving. Because auto mode was on, the Write and Edit tools applied the changes right away. The diff above was shown *after* the file was saved, not as a proposal.

**Final file:**

```python
# This script prints a greeting.
print("Hello, world!")
```

Running it again still printed `Hello, world!`.

## 4. Reflection

- **Steps that occurred:**
  - Claude read `greeting.py` before editing it (step 1).
  - Claude applied the change (step 4).
  - Claude checked the result by showing the diff, printing the final file, and running the script (step 5).
  - The work was split into small steps: create the file, commit it, then edit it.
- **Steps that did not occur:**
  - No diff was shown *before* saving (step 2).
  - Claude did not wait for my approval (step 3).
- **Approval behavior:** Claude edited the file automatically. The diff was shown afterwards for review, not as a proposal to accept or reject. This is expected in auto mode. In the default permission mode, Claude Code shows the proposed edit and asks for approval before each file change. To see that approval flow, run the test again in default mode.
- **My experience:** The change was easy to follow because the diff was one line long. Each step was also committed separately, so I could review it in git history and undo it if needed. Without the approval prompt, reviewing happens after the change instead of before it. For small, low-risk edits like this one, that felt comfortable. For larger changes, I would prefer default mode so I can approve each edit.

This test showed that Claude Code changes real project files, not just code in a conversation. How it handles approval depends on the permission mode, so reviewing diffs and checking the final result remain important.

## 5. Submission

- Google Docs sharing: Anyone with the link can edit
- Document link: https://drive.google.com/drive/folders/1NX9ZEhzBcooeSe2J7gZbvaLsdZB-_zBX
