const GHome = require('../ghome.js');

module.exports = function (RED) {

    function GHomePlayNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            const ghome = new GHome(config.ip, config.lang);

            try {
                await ghome.connect();
                let volume = await ghome.getVolume();
                if (config.customVolume) {
                    await ghome.setVolume(parseInt(config.volume));
                }
                await ghome.play(msg.payload);
                if (config.customVolume) {
                    await ghome.setVolume(volume);
                }
                await ghome.disconnect();
            } catch (err) {
                node.error(err);
            }
        });
    }

    RED.nodes.registerType("ghome-play", GHomePlayNode);

};