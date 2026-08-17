import os
import re

api_dir = 'app/api/admin'

# Pattern to match the check in any state (original or already-doubled)
# We'll normalize ALL occurrences to the canonical clean form
# For settings - handle separately below

clean_admin_pattern = re.compile(
    r"(!admin \|\| admin\.role !== 'ADMIN'(?:\s*&&\s*admin\.role !== 'SUPER_ADMIN')*)"
)
clean_user_pattern = re.compile(
    r"(!user \|\| user\.role !== 'ADMIN'(?:\s*&&\s*user\.role !== 'SUPER_ADMIN')*)"
)

ADMIN_REPLACEMENT = "!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')"
USER_REPLACEMENT  = "!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')"

for root, dirs, files in os.walk(api_dir):
    for fname in files:
        if not fname.endswith('.js'):
            continue
        path = os.path.join(root, fname)
        is_settings = 'settings' in path

        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        if is_settings:
            # Settings: require SUPER_ADMIN only
            new_content = re.sub(
                r"!admin \|\| (?:\()?admin\.role !== 'ADMIN'(?:\s*&&\s*admin\.role !== 'SUPER_ADMIN')*(?:\))?",
                "!admin || admin.role !== 'SUPER_ADMIN'",
                content
            )
        else:
            # All others: allow ADMIN or SUPER_ADMIN
            new_content = clean_admin_pattern.sub(ADMIN_REPLACEMENT, content)
            new_content = clean_user_pattern.sub(USER_REPLACEMENT, new_content)

            # Also handle the ?. optional chaining variants
            new_content = re.sub(
                r"!admin \|\| (?:\()?admin\?\.role !== 'ADMIN'(?:\s*&&\s*admin\?\.role !== 'SUPER_ADMIN')*(?:\))?",
                "!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')",
                new_content
            )
            new_content = re.sub(
                r"!user \|\| (?:\()?user\?\.role !== 'ADMIN'(?:\s*&&\s*user\?\.role !== 'SUPER_ADMIN')*(?:\))?",
                "!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')",
                new_content
            )

        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print('Fixed:', path)

print('All done')
