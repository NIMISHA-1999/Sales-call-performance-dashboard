<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;  
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\CallRecord;
use Carbon\Carbon;


class CallRecordsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
{
    // Skip duplicate call_id
    $existing = CallRecord::where('call_id', $row['call_id'])->first();
    if ($existing) {
        return null;
    }

    // Skip invalid call_time
    if (empty($row['call_time']) || strtolower($row['call_time']) === 'totals' || !strtotime($row['call_time'])) {
        return null;
    }

    return new CallRecord([
        'call_time' => Carbon::parse($row['call_time']),
        'call_id' => $row['call_id'],
        'from' => $row['from'],
        'to' => $row['to'],
        'direction' => $row['direction'],
        'status' => strtolower($row['status']),
        'ringing' => $this->convertTimeToSeconds($row['ringing']),
        'talking' => $this->convertTimeToSeconds($row['talking']),
        'cost' => floatval($row['cost']),
        'agent_name' => $row['agent_name'] ?? $row['to'],
    ]);
}

/**
 * Convert time format (HH:MM:SS or MM:SS) to seconds
 */
private function convertTimeToSeconds($time)
{
    if (is_numeric($time)) {
        // Already in seconds
        return intval($time);
    }

    if (strpos($time, ':') !== false) {
        $parts = explode(':', $time);
        $parts = array_reverse($parts); // Reverse so seconds are index 0
        $seconds = intval($parts[0] ?? 0);
        $minutes = intval($parts[1] ?? 0);
        $hours = intval($parts[2] ?? 0);
        return $hours * 3600 + $minutes * 60 + $seconds;
    }

    return 0;
}

}
