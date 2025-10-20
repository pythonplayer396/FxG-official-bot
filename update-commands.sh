#!/bin/bash
# Script to update all command files to remove embeds and use simple messages

# This script will replace CustomEmbedBuilder with Messages utility
# Run this after reviewing the changes

echo "Updating command files to remove embeds..."

# Find all command files and replace CustomEmbedBuilder imports with Messages
find src/commands -name "*.js" -type f -exec sed -i "s/const CustomEmbedBuilder = require('.*embedBuilder');/const Messages = require('..\/..\/utils\/messages');/g" {} \;

echo "Updated imports in command files"
echo "Note: You'll need to manually update the actual embed usage to simple messages"
echo "Pattern: CustomEmbedBuilder.success('Title', 'Message') -> Messages.success('Message')"
