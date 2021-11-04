import sys
def validate_password_strength(value):
    min_length = 8

    if len(value) < min_length:
        return False

    # check for digit
    if not any(char.isdigit() for char in value):
        return False

    # check for letter
    if not any(char.isalpha() for char in value):
        return False
    return True

sys.modules[__name__] = validate_password_strength