FROM postgres:17

ENV PG_CRON_VERSION=1.6.7
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    git \
    postgresql-server-dev-17 \
    && wget -O /pg_cron.tgz https://github.com/citusdata/pg_cron/archive/v$PG_CRON_VERSION.tar.gz \
    && tar -xzf /pg_cron.tgz --directory / \
    && cd /pg_cron-$PG_CRON_VERSION \
    && make && make install \
    && cd / \
    && rm -rf /pg_cron.tgz /pg_cron-$PG_CRON_VERSION \
    && apt-get purge -y build-essential git wget postgresql-server-dev-17 \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*