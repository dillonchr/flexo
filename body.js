module.exports = (stream, onResponse) => {
    const body = [];
    stream
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', () => {
            try {
                const data = JSON.parse(Buffer.concat(body).toString());
                onResponse(null, data);
            } catch (err) {
                onResponse(err);
            }
        });
};
