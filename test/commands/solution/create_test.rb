require "test_helper"

class Solution::CreateTest < ActiveSupport::TestCase
  test "raises unless exercise is available" do
    ex = create :concept_exercise
    ut = create :user_track, track: ex.track
    UserTrack.any_instance.expects(:exercise_available?).with(ex).returns(false)

    assert_raises ExerciseUnavailableError do
      Solution::Create.(ut.user, ex)
    end
  end

  test "creates concept_solution" do
    ex = create :concept_exercise
    ut = create :user_track, track: ex.track
    UserTrack.any_instance.expects(:exercise_available?).with(ex).returns(true)

    solution = Solution::Create.(ut.user, ex)
    assert solution.is_a?(ConceptSolution)
    assert_equal ut.user, solution.user
    assert_equal ex, solution.exercise
  end

  test "creates practice_solution" do
    ex = create :practice_exercise
    ut = create :user_track, track: ex.track
    UserTrack.any_instance.expects(:exercise_available?).with(ex).returns(true)

    solution = Solution::Create.(ut.user, ex)
    assert solution.is_a?(PracticeSolution)
    assert_equal ut.user, solution.user
    assert_equal ex, solution.exercise
  end

  test "idempotent" do
    user = create :user
    ex = create :concept_exercise
    ut = create :user_track, user: user, track: ex.track
    UserTrack.any_instance.expects(:exercise_available?).with(ex).returns(true).twice

    assert_idempotent_command { Solution::Create.(ut.user, ex) }
  end

  test "creates activity" do
    user = create :user
    exercise = create :concept_exercise
    ut = create :user_track, user: user, track: exercise.track

    Solution::Create.(ut.user, exercise)

    activity = User::Activities::StartedExerciseActivity.last
    assert_equal user, activity.user
    assert_equal exercise.track, activity.track
    assert_equal exercise, activity.exercise
  end
end
