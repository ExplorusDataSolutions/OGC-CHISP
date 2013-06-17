app -> http://ogc-chisp-env-egseatsx3u.elasticbeanstalk.com/
GN => http://chisp.elasticbeanstalk.com/srv/en/main.home


CHISP - migrate to PYCSW

2013-05-29 11:23 Wednesday

Install ruby, unicorn, bundle
Install unicorn for executing unicorn -D -c config/unicorn.conf -E production

$ sudo gem install unicorn
Install bundler for executing bundle install

$ sudo gem install bundler
In order to successfully execute bundle install, gem libxml-ruby and sqlite3 need bellow dependencies installed.

For dependency of gem libxml-ruby, which will be installed by bundle install

sudo apt-get install zlib1g-dev libxml2-dev
For dependency of gem sqlite3, which will be installed by bundle install

sudo apt-get install libsqlite3-dev
Upload source using git
Install git on server

sudo apt-get install git
Create and configure an empty repo on server

$ mkdir OGC-CHISP
$ cd OGC-CHISP/
$ git init
Initialized empty Git repository in /home/mlhch/OGC-CHISP/.git/
$ git config receive.denyCurrentBranch ignore
Upload source from client

$ git push mlhch@172.16.54.131:OGC-CHISP/.git master
mlhch@172.16.54.131's password: 
Counting objects: 1425, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (1289/1289), done.
Writing objects: 100% (1425/1425), 384.01 KiB, done.
Total 1425 (delta 845), reused 3 (delta 0)
To mlhch@172.16.54.131:OGC-CHISP/.git
 * [new branch]      master -> master
Check out source in repo on server

$ git reset --hard
HEAD is now at 39d43b9 change ip from 140.134.48.13 to 59.125.87.213
execute bundle install in the project root

$ bundle install
Fetching gem metadata from https://rubygems.org/.........
Fetching gem metadata from https://rubygems.org/..
Using rake (10.0.3) 
Using i18n (0.6.1) 
Using multi_json (1.5.0) 
...
Using sass-rails (3.2.5) 
Installing sqlite3 (1.3.6) 
Installing uglifier (1.3.0) 
Installing uuidtools (2.1.3) 
Your bundle is complete!
Use `bundle show [gemname]` to see where a bundled gem is installed.
Uninstall rack 1.5.2 and make sure rack 1.4.3 installed to avoid below error.

You have already activated rack 1.5.2, but your Gemfile requires rack 1.4.3.
$ sudo gem uninstall rack -v 1.5.2
Successfully uninstalled rack-1.5.2
Install NodeJs to avoid bellow error.

Could not find a JavaScript runtime
$ sudo apt-get install nodejs
Start server using unicorn

$ rake assets:precompile
$ unicorn -D -c config/unicorn.conf -E production
If needed, use ps aux | grep unicorn and kill to stop unicorn and restart it. Visit http://server_ip:8080, the site should work.

The PYCSW instance already have Apache2 running to serve http://server_ip/pycsw/csw.py as CSW service. So, if we want http://server_ip to show the CHISP site, we can use Apache2's ProxyPass directive.

ProxyPass /pycsw/ !
ProxyPass / http://127.0.0.1:8080/
In order to make it work, we should use a2enmod command to enable Apache2's proxy module. Then add above 2 lines to proxy.conf

$ sudo a2enmod proxy proxy_http
Enabling module proxy.
Considering dependency proxy for proxy_http:
Module proxy already enabled
Enabling module proxy_http.
To activate the new configuration, you need to run:
  service apache2 restart
$ sudo vi /etc/apache2/mods-enabled/proxy.conf
Use Upstart to make App auto started. To be continued...
