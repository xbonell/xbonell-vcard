# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

# nutils
require 'nutils'

# Helpers
include Nanoc3::Helpers::XMLSitemap
include Nanoc3::Helpers::Rendering 
include Nanoc3::Helpers::Localization
