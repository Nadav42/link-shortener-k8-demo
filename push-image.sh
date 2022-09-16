if [[ $# -eq 0 ]] ; then
    echo 'usage: ./push-image.sh <image-tag>'
    exit 1
fi

git fetch

git pull

docker build . -t docker.io/nadav42/link-shortener:$1

docker push docker.io/nadav42/link-shortener:$1