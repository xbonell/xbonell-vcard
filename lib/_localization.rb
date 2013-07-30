module Nanoc3::Helpers

  $site_languages = ['ca','en','es']

  module Localization

    def language_code_of(item)
      # "/en/foo/" becomes "en"
      (item.identifier.match(/^\/([a-z]{2})\//) || [])[1]
    end

    def translations_of(item)
      @items.select do |i| 
        i[:slug] == item[:slug]
      end
    end

    def translation_of(item, params={})
      translations_of(item).find { |i| language_code_of(i) == params[:in] }
    end

    LANGUAGE_CODE_TO_NAME_MAPPING = {
      'ca' => 'Català',
      'en' => 'English',
      'es' => 'Español'
    }

    def language_name_for_code(code)
      LANGUAGE_CODE_TO_NAME_MAPPING[code]
    end

    def language_name_of(item)
      language_name_for_code(
        language_code_of(item))
    end

  end

end