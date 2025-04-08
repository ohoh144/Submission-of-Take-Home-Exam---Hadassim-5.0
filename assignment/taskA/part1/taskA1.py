# Odelya Magrafta 207839978 Task A Exercise 1 

"""
Time Complexity Analysis:

Reading the log file and parsing each line takes O(n), where n is the number of lines.
Extracting error codes and updating the frequency counter is also O(n), since it's done per line.
Getting the top N most frequent error codes costs:
  O(k log N) on average if using a min-heap (efficient approach),
  O(k log k) in the worst case if full sorting is used,
  where k is the number of unique error codes.

Overall Time Complexity:
    Best/Average Case: O(n + k log N)
    Worst Case:        O(n + k log k)ש

#Space Complexity:
O(k + partition_size ) for storing counts and a temporary chunk.
"""
import re  
import sys
from collections import Counter

text_file = "logs.txt"
partition_size = 10000  

def extract_error_from_line(line: str):
    pass
def count_errors_by_type():
    pass
def get_top_frequent_error_by_n(counter: Counter,n: int):
    pass
def main():
    pass

# This function extracts the error code from a given line of log.
# Input: a single log line as a string.
# Output: the extracted error code (string) or None if not found.
def extract_error_from_line(line):
    match1 = re.search(r"Error:\s*(\S+)", line)
    if match1:
        return match1.group(1)
    else:
        return None

# This function reads the log file in chunks and counts how many times each error appears.
# Input: none (uses global file path).
# Output: Counter object mapping each error code to its frequency.
def count_errors_by_type():
    counter = Counter()
    temp_list_of_partition_lines = []  

    with open(text_file,"r")as file:
        for i, line in enumerate(file, 1):
            line = line.strip().strip('"')  
            temp_list_of_partition_lines.append(line)

            if i % partition_size == 0: 
                for l in temp_list_of_partition_lines:
                    error = extract_error_from_line(l)
                    if error:
                        counter[error] += 1
                temp_list_of_partition_lines.clear()

        for l in temp_list_of_partition_lines:
            error = extract_error_from_line(l)
            if error:
                counter[error] += 1

    return counter

# This function returns the top N most frequent error codes.
# Input: a Counter object and the number N.
# Output: a list of (error, count) tuples.
def get_top_frequent_error_by_n(counter, n):
    return counter.most_common(n)

# This is the main entry point of the script.
# Input: receives N from command line arguments.
# Output: prints the top N frequent errors to the console.
def main():
    if len(sys.argv)< 2:
        print("Not enough arguments were provided to the program")
        return

    try:
        N = int(sys.argv[1])
    except ValueError:
        print("N must be an integer")
        return

    counter = count_errors_by_type()
    print(f"\n{N} Most frequent error codes are:")
    for code, count in get_top_frequent_error_by_n(counter, N):
        print(f"{code}:{count}")

if __name__ == "__main__":
    main()

    """
    Console output example:

    python taskA1.py
    Not enough arguments were provided to the program

    python taskA1.py s
    N must be an integer

    python taskA1.py 5

    5 Most frequent error codes are:
    WARN_101:200098
    ERR_404:200094
    ERR_400:200069
    INFO_200:199931
    ERR_500:199808
    
    """
