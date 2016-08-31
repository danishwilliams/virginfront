# This allows us to test the API response times, after noticing 5 minute response times on staging and production
# on 6 May 2016.
#
# Usage:
# $ bash test-api-response-time.sh
#
# You'll probably need to replace the token in follows the 'Authorization: Token ' with a Manager/Tech Manager token

echo 'api/users/me'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/users/me?roger=1' -H 'Cookie: ?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' -H 'Cache-Control: max-age=0' --compressed
echo 'api/gyms/syncinfo/detailed'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/gyms/syncinfo/detailed?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/devices/status'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/devices/status?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/reports/instructor/count/state'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/reports/instructor/count/state?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/reports/instructor/count/activity/14'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/reports/instructor/count/activity/14?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/communications/logs/fail?page=1&resultCount=10000'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/communications/logs/fail?page=1&resultCount=10000&roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/reports/templates/count/playlists/30'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/reports/templates/count/playlists/30?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/reports/gym/count/ridestaught/30'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/reports/gym/count/ridestaught/30?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/playlists?includeGoals=false&resultCount=4'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/playlists?includeGoals=false&resultCount=4&roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/playlists/recentclasses?resultCount=10'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/playlists/recentclasses?resultCount=10&roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/gyms/3688eb52-896f-446e-ad38-a24af98608a7/playlistsnotpublished'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/gyms/3688eb52-896f-446e-ad38-a24af98608a7/playlistsnotpublished?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed
echo 'api/gyms/ae08e3a7-9efb-43ec-9f3f-28ab46527d55/playlistsnotpublished'
curl -w "@curl-format.txt" -o /dev/null -s 'https://ride.digitaldisruption.co.za/api/gyms/ae08e3a7-9efb-43ec-9f3f-28ab46527d55/playlistsnotpublished?roger=1' -H 'Cookie: BIGipServer~Mobile_Apps~MyQA_pool=1424890564.47873.0000; ASP.NET_SessionId=1rbwqmdjmkrs0eb3c3ezr1du?roger=1' -H 'Accept-Encoding: gzip, deflate, sdch?roger=1' -H 'Accept-Language: en-US,en;q=0.8?roger=1' -H 'Authorization: Token e3f8a077304243e482958f0954e9cf89' -H 'Accept: application/json, text/plain, */*?roger=1' -H 'Referer: https://ride.digitaldisruption.co.za/dashboard?roger=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' -H 'Connection: keep-alive' --compressed