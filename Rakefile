task :default => [:safari, :standalone]

desc 'Build standalone file'
task :standalone => ['chrome/focus-snail.js', 'chrome/focus-snail.css'] do
  require 'jspp'
  File.open('standalone/focus-snail.js', 'w') { |file|
    text = JSPP('standalone/focus-snail.jspp.js')
    file.write(text)
  }
  puts 'standalone/focus-snail.js'
end


desc 'Build Safari extension to ./FocusSnail.safariextension/'
task :safari => ['chrome/focus-snail.js', 'chrome/focus-snail.css'] do
  cp_r ['chrome/focus-snail.js', 'chrome/focus-snail.css'], 'FocusSnail.safariextension'
  puts 'FocusSnail.safariextension'
end


task :compile => [:standalone, 'standalone/extern.js'] do
  exec <<SHELL_COMMAND
  java -jar ~/closure/latest.jar\\
    --js standalone/focus-snail.js\\
    --js_output_file standalone/focus-snail.min.js\\
    --compilation_level ADVANCED_OPTIMIZATIONS\\
    --externs standalone/extern.js\\
    --warning_level VERBOSE\\
    --language_in ECMASCRIPT5_STRICT\\
    --logging_level FINEST\\
    --summary_detail_level 3\\
    --formatting PRETTY_PRINT
SHELL_COMMAND
end


#FIXME
#task :firefox do
#
#end

#FIXME
#task :ie do
#
#end
