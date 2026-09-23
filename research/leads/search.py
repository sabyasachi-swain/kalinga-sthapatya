import re

with open(r"C:\Users\sabya\.gemini\antigravity\brain\79620823-145f-472a-bc9f-dd3385323e3e\.system_generated\steps\20\content.md", "r", encoding="utf-8") as f:
    text = f.read()

# search for the text
lines = text.split('\n')
start_idx = -1
for i, line in enumerate(lines):
    if "X. THE DIFFERENT TYPES OF ORISSAN TEMPLES" in line and i > 500:
        start_idx = i
        break

if start_idx != -1:
    print('\n'.join(lines[start_idx:start_idx+150]))
else:
    # search for "rekha"
    for i, line in enumerate(lines):
        if "rekha" in line.lower() and "bhadra" in line.lower() and i > 500:
            print('\n'.join(lines[i-10:i+50]))
            break
