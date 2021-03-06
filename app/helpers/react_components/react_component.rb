module ReactComponents
  class ReactComponent
    extend Mandate::Memoize
    extend Mandate::InitializerInjector

    include ActionView::Helpers::TagHelper

    def to_s(id, data)
      tag.div(
        "",
        {
          "data-react-#{id}": true,
          "data-react-data": data.to_json
        }
      )
    end
  end
end
