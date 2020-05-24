#!/bin/bash
DIRS="swagger config"
BASE_DIR="./src"
DEST_DIR="./dist/"
#for i in ${DIRS[@]}; do
#    mkdir -p ${DEST_DIR}
#    echo "Copying Directory: ${BASE_DIR}/${i} to: ${DEST_DIR}"
#    cp -R ${BASE_DIR}/${i} ${DEST_DIR}
#done
FILES="swagger.json"
for i in ${FILES[@]}; do
    mkdir -p ${DEST_DIR}
    echo "Copying Files: ${BASE_DIR}/${i} to: ${DEST_DIR}"
    cp -R ${BASE_DIR}/${i} ${DEST_DIR}
done

exit 0