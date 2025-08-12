<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

use App\Models\UploadedFile;
use App\Models\CallRecord;
use App\Imports\CallRecordsImport;

class FileUploadController extends Controller
{
    //  public function store(Request $request)
    // {
    //     $request->validate([
    //         'file' => 'required|mimes:xlsx,xls,csv|max:51200' // 50MB
    //     ]);

    //     $file = $request->file('file');
    //     $fileName = time().'_'.$file->getClientOriginalName();
    //     $filePath = $file->storeAs('uploads', $fileName, 'public');

    //     // Save to DB
    //     UploadedFile::create([
    //         'file_name' => $fileName,
    //         'file_path' => $filePath,
    //         'status' => 'Success'
    //     ]);

    //     return response()->json([
    //         'message' => 'File uploaded successfully',
    //         'file_name' => $fileName
    //     ]);
    // }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:51200' // 50MB max
        ]);

        $file = $request->file('file');
        $fileName = time().'_'.$file->getClientOriginalName();
        $filePath = $file->storeAs('uploads', $fileName, 'public');

        $uploadedFile = UploadedFile::create([
            'file_name' => $fileName,
            'file_path' => $filePath,
            'status' => 'Success'
        ]);

        Excel::import(new CallRecordsImport, $file);

        $uploadedFile->update(['status' => 'Success']);

        return response()->json([
            'message' => 'File uploaded and processed successfully',
            'file_name' => $fileName
        ]);
    }

    public function agentPerformance()
    {
       $data = CallRecord::selectRaw("
    `from` as agent_name,
    COUNT(*) as total_calls,
    SUM(CASE WHEN status = 'answered' THEN 1 ELSE 0 END) as answered_calls,
    SUM(CASE WHEN status != 'answered' THEN 1 ELSE 0 END) as unanswered_calls,
    SUM(talking) as total_talking_seconds,
    (SUM(CASE WHEN status = 'answered' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as answered_percentage  
")                                                                                    //Answered percentage:(answered_calls / total_calls) * 100
->groupBy('from')
->get();



        // Format talk time
        $data->transform(function ($item) {
            $seconds = $item->total_talking_seconds;
            $hours = floor($seconds / 3600);
            $minutes = floor(($seconds % 3600) / 60);
            $seconds = $seconds % 60;
            $item->talk_time = sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
            return $item;
        });

        return response()->json($data);
    }

     public function index(Request $request)
    {
        $perPage = 5;
        $files = UploadedFile::orderBy('created_at', 'desc')->paginate($perPage);
        return response()->json($files);
    }

//    public function index(Request $request)
// {
//     $perPage = 5;
//     $page = $request->input('page', 1);  // current page from request, default 1

//     $files = \App\Models\UploadedFile::orderBy('created_at', 'desc')->paginate($perPage);

//     return response()->json($files);
// }


}
