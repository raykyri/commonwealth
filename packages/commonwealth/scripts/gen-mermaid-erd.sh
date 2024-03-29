#!/bin/bash

# using default local configuration
# TODO: read PG vars from .env?

SQL=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/mermaid-erd.sql
MERMAID=$(PGPASSWORD=edgeware psql -h localhost -d commonwealth -U commonwealth -t -A -f $SQL)
echo -e "# Autogenerated Mermaid ERD\n\nLast updated: $(date)\n\n\`\`\`mermaid\n$MERMAID\n\`\`\`"

