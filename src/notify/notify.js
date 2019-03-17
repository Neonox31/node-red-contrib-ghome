const GHome = require('../ghome.js');

const isValidVolume = (volume) => {
    if (isNaN(volume)) {
        return false;
    }

    return !(volume < 0 || volume > 100);
};

module.exports = function (RED) {

    function GHomeNotifyNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            const ghome = new GHome(config.ip, config.lang);

            try {
                await ghome.connect();
                let initialVolume = await ghome.getVolume();
                const customVolume = msg.volume != null ? msg.volume : parseInt(config.volume);

                if (isValidVolume(customVolume)) {
                    await ghome.setVolume(parseInt(customVolume));
                }

                await ghome.notify(msg.payload);

                if (isValidVolume(customVolume)) {
                    await ghome.setVolume(initialVolume);
                }

                await ghome.disconnect();
            } catch (err) {
                node.error(err);
            }
        });
    }

    RED.nodes.registerType("ghome-notify", GHomeNotifyNode);

};