# Odelya Magrafta 207839978 Task A Exercise 2 

import pandas  # type: ignore
import os

pandas.set_option('display.max_rows', None) 

os.makedirs("results" , exist_ok=True)

def read_file_by_type(path_of_file):
    pass
def clean_the_data(input_path, output_path):
    pass
def get_hourly_averages(table):
    pass
def get_hourly_averages_per_day(table, base_folder):
    pass
def run_process(path_of_CSV, path_of_clean_CSV, subfolder_results):
    pass
def main():
    pass

# This function reads a file (CSV or Parquet)
# Input: file path
# Output: DataFrame and file type string
def read_file_by_type(path_of_file):
    if path_of_file.endswith(".parquet"):
        table = pandas.read_parquet(path_of_file)
        type_of_file = "Parquet"
    else:
        table = pandas.read_csv(path_of_file)
        type_of_file = "CSV"
    return table, type_of_file


# Answer to B1 -> 1
# This function cleans the data (parse,remove duplicates,save cleaned file)
# Input: input path, output path
# Output: cleaned DataFrame and file type string
def clean_the_data(input_path, output_path):
    table, type_of_file = read_file_by_type(input_path)

    table['timestamp'] = pandas.to_datetime(table['timestamp'], errors='coerce', format="%Y-%m-%d %H:%M:%S")

    if type_of_file == "Parquet":
        table.rename(columns={'mean_value': 'value'}, inplace=True)

    table['value'] = pandas.to_numeric(table['value'], errors='coerce')
    table.dropna(subset=['timestamp', 'value'], inplace=True)

    dup_mask = table['timestamp'].duplicated(keep=False)
    table = table[~dup_mask]

    table.sort_values(by='timestamp', inplace=True)
    table['timestamp'] = table['timestamp'].dt.strftime("%d/%m/%Y %H:%M:%S")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    table.to_csv(output_path, index=False)

    return table, type_of_file


# Answer to B1 -> 2
# This function calculates hourly average from a DataFrame
# Input: cleaned DataFrame
# Output: DataFrame with hourly averages
def get_hourly_averages (table):
    table['timestamp'] = pandas.to_datetime(table['timestamp'], format="%d/%m/%Y %H:%M:%S")
    table['rounded_hour'] = table['timestamp'].dt.floor('h')
    avarage_table = table.groupby('rounded_hour')['value'].mean().reset_index()
    avarage_table.rename(columns={
        'rounded_hour': 'Start Time',
        'value': 'Average'
    }, inplace=True)
    return avarage_table


# Answer to B2
# This function calculates hourly averages for each day and saves them
# Input: cleaned DataFrame, folder to save results
# Output: DataFrame with all daily averages combined
def get_hourly_averages_per_day(table, base_folder):
    day_folder = os.path.join(base_folder, "daily_averages")
    os.makedirs(day_folder, exist_ok=True)

    table['timestamp'] = pandas.to_datetime(table['timestamp'], format="%d/%m/%Y %H:%M:%S")
    table['date'] = table['timestamp'].dt.date

    all_days = []

    for date in table['date'].unique():
        one_day = table[table['date'] == date].copy()
        avarage = get_hourly_averages(one_day)
        avarage.rename(columns={'Start Time':'זמן התחלה', 'Average':'ממוצע'}, inplace=True)

        output_file = os.path.join(day_folder, f"hourly_{date}.csv")
        avarage.to_csv(output_file, index=False, encoding='utf-8-sig')
        all_days.append(avarage)

    return pandas.concat(all_days, ignore_index=True)


# This function runs the full process: clean,calculate averages,save
# Input: path to input file, name for cleaned file, folder to save outputs
# Output: none (writes files)
def run_process(path_of_CSV, path_of_clean_CSV, subfolder_results):
    path = os.path.join("results", subfolder_results)
    os.makedirs(path, exist_ok=True)

    cleaned_file = os.path.join(path, path_of_clean_CSV)

    table, _ = clean_the_data(path_of_CSV, cleaned_file)

    average_by_hour = get_hourly_averages (table)
    average_by_hour.rename(columns={'Start Time': 'זמן התחלה', 'Average': 'ממוצע'}, inplace=True)
    average_by_hour.to_csv(os.path.join(path, "hourly_averages.csv"), index=False, encoding='utf-8-sig')

    average_by_day = get_hourly_averages_per_day (table, path)
    average_by_day.to_csv(os.path.join(path, "hourly_averages_by_day.csv"), index=False, encoding='utf-8-sig')


# This is the main function to run both CSV and Parquet processing
# Input: none
# Output: none
def main():
    run_process("time_series.csv", "time_series_clean.csv", "CSV_results")
    run_process("time_series (4).parquet", "time_series_clean.csv", "PARQUET_results")


if __name__ == "__main__":
    main()




# Answer to B3 – streaming 
'''

I really enjoyed this question,

I came up with a solution that fits real-time data streaming, where data keeps coming and we can’t store the entire history.
Instead of keeping everything, I store each value by its exact timestamp in a dictionary : so if the same timestamp appears again, I can immediately recognize it.
To calculate the average live, I keep two variables: one for the total sum of all valid values, and one for the count. Every time a new value arrives, I add it to the sum, increase the count, and update the average using sum / count.
If a duplicate timestamp appears, I remove the previous value from the dictionary, subtract it from the sum and count, and then mark that timestamp as “blocked” so it won’t be added again in the future.
For hourly averages, I apply the same logic but store separate sums and counts for each full hour (like 08:00).
This way, I can calculate accurate and up-to-date averages, detect duplicates, and keep the memory usage low : which makes it perfect for a true streaming environment.

Extension :

I thought of an approach that fits situations with limited memory, like in streaming systems.
Instead of storing all the values, we can just keep the total sum, the count, and the sum of squares : and use them to calculate the average and standard deviation on the fly.
If we also want the option to remove a value (for example, if a duplicate timestamp appears), we can store each value by its timestamp and subtract it from the calculations when needed.
This can also be applied per hour — by keeping only the statistical data and timestamped values for each hour, we can get accurate hourly averages without wasting memory.
It’s a simple and efficient way to stay accurate even when working with large amounts of streaming data.


I considered the available resources and system needs, aiming for an efficient solution that fits the constraints.
My goal was to support accurate and continuous data processing in a streaming environment.

In the end, it’s always important to set clear priorities, understand what is truly needed and what data we have — and only then choose the most suitable and effective path forward.


'''

# Answer to B4 – Parquet file format: The advantages of using this file format are as follows:

'''
At first, I worked with the CSV file, which stores all the data in rows. I split the file into smaller parts based on time (like hours or days), calculated hourly averages for each part, and combined the results into one final file, just like in the example from part B.
Later, when we switched to using a Parquet file, I saw the difference. Parquet stores the data by columns instead of rows, so I could load only the specific columns I needed (like timestamp and value) without wasting memory or time on the rest. This made the whole process much faster and more efficient.
Also, Parquet files include built-in information about the data types (called a schema), so I didn’t need to check or define the data types every time the file already knows that timestamp is a date and value is a number. This saved time and helped avoid errors, especially when working with large amounts of data or in stream processing.

In short: Parquet is smaller, faster, easier to work with, and just a better choice when dealing with big data and advanced analysis.

'''