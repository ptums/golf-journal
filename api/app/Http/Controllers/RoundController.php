<?php

namespace App\Http\Controllers;

use App\Models\Round;
use App\Models\Scores;
use Illuminate\Http\Request;

class RoundController extends Controller
{

    public function store(Request $request, Round $round, Scores $scores)
    {
        //
        $input = $request->validate([
            'rounds' => 'required',
            'courses_id' => 'required',
            'user_id' => 'required'
        ]);

        $input['user_id'] = $request->user()->id;
        $single_round = $round::where('courses_id', $input['courses_id'])->where('user_id', $input['user_id'])->first();
        $single_score = $scores::where('courses_id', $input['courses_id'])->where('user_id', $input['user_id'])->first();
        $create_round = null;
        $create_score = null;
        $score = 0;

        $decoded_rounds = json_decode($input['rounds']);

        foreach ($decoded_rounds as $dr) {
            if(isset($dr->score)) {
                $score = $score += $dr->score;
            }
        }

        try {
            if($single_round) {
                $single_round->update($input);
            }else {
                $create_round = $round::create($input);
            }

            if($single_score) {
                $score_input = [
                    'score' => $score
                ];

                $single_score->update($score_input);
            }else {
                $score_input = [
                    'user_id' => $input['user_id'],
                    'courses_id' => $input['courses_id'],
                    'score' => $score
                ];

                $create_score = $scores::create($score_input);
            }

        } catch(Throwable $e) {

            return response()->json([
                'status' => 500,
                'error' => $e,
            ], 500);
        }



        return response()->json([
            'status' => 201,
            'data' => 'rounded updated/created'
        ], 201);



    }

    public function search(Request $request, Round $round, Scores  $scores) {
        $input = $request->validate([
            'user_id' => 'required',
            'courses_id' => 'required'
        ]);

        $single_round = $round::where('courses_id', $input['courses_id'])->where('user_id', $input['user_id'])->first();
        $single_score = $scores::where('courses_id', $input['courses_id'])->where('user_id', $input['user_id'])->first();

        $results = $single_round;
        $results['score'] = $single_score->score;

        if(!$single_round) {
            return response()->json([
                'status' => 404,
                'data' => "Rounds not found",
                'single_round' => $results
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $results
        ], 200);
    }
}
