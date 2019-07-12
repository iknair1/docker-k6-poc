FROM registry.sbx.zone/loadimpact-k6:latest
COPY . ./
ENTRYPOINT [ "k6" ]