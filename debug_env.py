import os
print("Current Directory:", os.getcwd())
print("Files in current directory:", os.listdir("."))
if os.path.exists("src"):
    print("Files in src:", os.listdir("src"))
else:
    print("src directory not found")
