import os
import re

api_dir = 'app/api/admin'

for root, dirs, files in os.walk(api_dir):
    for fname in files:
        if not fname.endswith('.js'):
            continue
        path = os.path.join(root, fname)

        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix 1: Missing closing paren after SUPER_ADMIN' {
        new_content = re.sub(
            r"(!admin \|\| admin\.role !== 'SUPER_ADMIN') \{",
            r"\1) {",
            content
        )
        
        # Fix 2: Missing closing paren after SUPER_ADMIN') {
        new_content = re.sub(
            r"\((admin|user)\??\.role !== 'ADMIN' && (admin|user)\??\.role !== 'SUPER_ADMIN'\) \{",
            r"(\1.role !== 'ADMIN' && \2.role !== 'SUPER_ADMIN')) {",
            new_content
        )

        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print('Syntax Fixed:', path)

print('Syntax fix done')
