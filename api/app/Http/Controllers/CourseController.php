<?php

namespace App\Http\Controllers;

use App\Models\course;
use App\Models\Round;
use App\Models\Scores;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(DB $db)
    {

       $courses_with_scores = $db::table('courses')
            ->leftJoin('scores', 'scores.courses_id', '=', 'courses.id')
            ->select('courses.*', 'scores.score')
            ->get();

       $courses = $db::table('courses')->get();


        return response()->json([
            'status' => 200,
            'data' =>$courses_with_scores
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Course  $course)
    {
        $input = $request->validate([
            'name' => 'required',
            'holes' => 'required',
        ]);

        $input['user_id'] = $request->user()->id;
        $input['played_at'] = Carbon::now();

        $create_course = null;
        try {
           $create_course = $course::create($input);

        } catch(Throwable $e) {

            return response()->json([
                'status' => 500,
                'error' => $e,
            ], 500);
        }



        return response()->json([
            'status' => 201,
            'data' => $create_course,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\course  $course
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, course $course)
    {
        //
        $input = $request->validate([
            'name' => 'sometimes',
            'holes' => 'sometimes',
            'id' => 'required',
            'played_at' => 'sometimes'
        ]);

        $update_course = null;
        try {
            $update_course = Course::where('id', $input['id'])->update($input);

        } catch(Throwable $e) {

            return response()->json([
                'status' => 500,
                'error' => $e,
            ], 500);
        }



        return response()->json([
            'status' => 201,
            'data' => $update_course,
            'input' => $input
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\course  $course
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Course $course, Round $round, Scores $scores)
    {
       $single_course = $course::find($id);
       $single_round = $round::where('courses_id', $id);
       $single_score = $scores::where('courses_id', $id);

       if(!empty($single_round)) {
           $single_round->delete();
       }

       if(!empty($single_score)) {
           $single_score->delete();
       }

       $single_course->delete();

        return response()->json([
            'status' => 200,
            'data' => "course ".$id." deleted",
        ], 200);
    }

    /**
     * Find a single course by id.
     * @param str $id
     * @return \Illuminate\Http\Response
     */
    public function search($id) {

        $single_course = Course::where('id', $id)->first();

        return response()->json([
            'status' => 200,
            'data' => $single_course,
        ], 200);
    }

}
