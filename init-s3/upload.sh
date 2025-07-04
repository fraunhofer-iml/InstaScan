#!/bin/sh

sleep 10

mc alias set skala_bucket http://skala-s3:9000 $S3_USER $S3_PASSWORD

mc cp /data/11877e04-ca7b-41eb-9022-d4deaead0fda.jpeg skala_bucket/skala-auavp/
mc cp /data/cdfc307e-fb65-4ed7-b917-391df2052db4.jpeg skala_bucket/skala-auavp/
mc cp /data/3a8aaca6-8b5d-4708-9162-bb136c2aa0f7.jpeg skala_bucket/skala-auavp/
mc cp /data/856d152e-b79b-43f3-8d13-ff0a94c1defc.jpeg skala_bucket/skala-auavp/
mc cp /data/93aa261f-327a-43b6-bb36-2d92be9f71d9.jpeg skala_bucket/skala-auavp/
