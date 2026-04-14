sync:
	git checkout dev && \
	git pull origin master --rebase && \
	npm install

sync-force:
	git checkout dev && \
	git fetch origin && \
	git reset --hard origin/master && \
	npm install

.PHONY: sync sync-force
