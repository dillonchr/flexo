module.exports = (stream, onResponse) => {
    const body = [];
    stream
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', () => {
            try {
                const data = JSON.parse(Buffer.concat(body).toString());
                const { applicationId } = data;
                if (applicationId === process.env.BANDWIDTH_APP_ID) {
                    onResponse(null, data);
                } else {
                    onResponse({unauthorized: true});
                }
            } catch (err) {
                onResponse({unauthorized: true, err: err.toString()});
            }
        });
};
