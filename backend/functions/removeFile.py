import os
import sys

def removeFile(src):
    if os.path.exists(src):
        os.remove(src)

sys.modules[__name__] = removeFile