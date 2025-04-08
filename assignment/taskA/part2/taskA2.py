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


