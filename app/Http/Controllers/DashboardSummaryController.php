<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CallRecord;

class DashboardSummaryController extends Controller
{
    
public function dashboardSummary(Request $request)
{
    $filter = $request->query('filter', 'today');

    $query = CallRecord::query();

    if ($filter === 'today') {
        $query->whereDate('created_at', today());
    } elseif ($filter === 'yesterday') {
        $query->whereDate('created_at', today()->subDay());
    } elseif ($filter === 'this_week') {
        $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    //   if ($filter === 'today') {
    //     $query->whereDate('call_time', today());
    // } elseif ($filter === 'yesterday') {
    //     $query->whereDate('call_time', today()->subDay());
    // } elseif ($filter === 'this_week') {
    //     $query->whereBetween('call_time', [now()->startOfWeek(), now()->endOfWeek()]);
    // }

    $totalCalls = $query->count();
    $answeredCalls = (clone $query)->where('status', 'answered')->count();
    $unansweredCalls = $totalCalls - $answeredCalls;

    $totalTalkSeconds = $query->sum('talking');
    $totalSales = (clone $query)->where('status', 'answered')->count();
    $answerRate = $totalCalls > 0 ? round(($answeredCalls / $totalCalls) * 100, 2) : 0;

    $topConnected = (clone $query)
        ->selectRaw('`from` as agent, COUNT(*) as total')
        ->groupBy('from')
        ->orderByDesc('total')
        ->first();

    $topSales = (clone $query)
        ->selectRaw('`from` as agent, COUNT(*) as total')
        ->where('status', 'answered')
        ->groupBy('from')
        ->orderByDesc('total')
        ->first();

    return response()->json([
        'total_sales' => $totalSales,
        'total_talk_time' => gmdate("H:i:s", $totalTalkSeconds),
        'total_calls' => $totalCalls,
        'top_connected' => $topConnected,
        'answered_calls' => $answeredCalls,
        'unanswered_calls' => $unansweredCalls,
        'answer_rate' => $answerRate,
        'top_sales' => $topSales
    ]);
}


}
