
DIR="$( pwd )"
cd ../conversations 
npm i
npm run build
CHAT_VERSION=$(jq -r '.version' package.json)
npm pack

cd $DIR 
cp ../conversations/ably-labs-chat-$CHAT_VERSION.tgz ./packages/ably-labs-chat.tgz
npm i ./packages/ably-labs-chat.tgz
