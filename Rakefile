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

#FIXME
#task :firefox do
#
#end

#FIXME
#task :ie do
#
#end
