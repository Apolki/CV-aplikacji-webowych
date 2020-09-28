import sys

count = int(sys.argv[3]) if len(sys.argv) > 3 else 1
with open(sys.argv[1]) as f:
        for _ in range(count):
          next(f)
        with open(sys.argv[2], 'w') as to:
                for line in f:
                        to.write(line)