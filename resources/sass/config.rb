sass_path = File.dirname(__FILE__)

css_path = File.join(sass_path, "..", "css")

#output_style = :compressed
output_style = :expanded

$ext4 = File.join(sass_path, "..", "..", "..", "ext-4.0.0", "resources", "themes")
Compass::Frameworks.register 'ext4', $ext4