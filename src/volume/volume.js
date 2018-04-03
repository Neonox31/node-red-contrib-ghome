const GHome = require('../ghome.js');

module.exports = function (RED) {

    function GHomeVolumeNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (_) {
            const ghome = new GHome(config.ip);

            try {
                await ghome.connect();
                await ghome.setVolume(parseInt(config.volume));
                await ghome.disconnect();
            } catch (err) {
                node.error(err);
            }
        });
    }

    RED.nodes.registerType("ghome-volume", GHomeVolumeNode);

};