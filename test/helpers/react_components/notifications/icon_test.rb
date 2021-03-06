require_relative "../react_component_test_case"

class NotificationsIconTest < ReactComponentTestCase
  test "notifications icon rendered correctly" do
    user = create(:user)
    create(:notification, user: user, read_at: nil)

    assert_component ReactComponents::Notifications::Icon.new(user),
      "notifications-icon",
      { count: 1 }
  end
end
