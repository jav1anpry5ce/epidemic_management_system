import sys
from datetime import datetime

def convertTime(time):
    size = len(str(time))
    t = str(time)[:size - 3]
    d = datetime.strptime(t, "%H:%M")
    return d.strftime("%I:%M %p")

sys.modules[__name__] = convertTime