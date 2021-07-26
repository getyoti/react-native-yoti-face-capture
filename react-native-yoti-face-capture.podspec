require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-yoti-face-capture"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]
  s.homepage     = 'https://github.com/getyoti/react-native-yoti-face-capture'
  s.source       = { :git => "https://github.com/getyoti/react-native-yoti-face-capture.git", :tag => "#{s.version}" }
  s.platforms    = { :ios => "12.0" }

  s.source_files = "ios/**/*.{h,m,mm}"

  s.dependency "React-Core"
  s.dependency "YotiFaceCapture", "3.0.0"
end
