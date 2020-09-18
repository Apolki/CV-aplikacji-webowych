import sys

with open(sys.argv[1]) as f:
        next(f)
        with open(sys.argv[2], 'w') as to:
                for line in f:
                        to.write(line)
