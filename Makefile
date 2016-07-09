.PHONY: \
	all \
	clean \
	doc

all: changelog doc

doc:
	jsdoc *.js *.md -d doc

clean:
	rm -rf doc

changelog:
	git2cl > CHANGES.txt
