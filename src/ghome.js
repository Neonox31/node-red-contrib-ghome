const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const Googletts = require('google-tts-api');

class GHome {

    constructor(ip, lang) {
        this.ip = ip;
        this.lang = lang || 'en_US';
        this.client = new Client();
    }

    async notify(text) {
        let url = await Googletts(text, this.lang, 1);
        await this.play(url);
    }

    async play(url) {
        const media = {
            contentId: url,
            contentType: 'audio/mp3',
            streamType: 'BUFFERED'
        };
        const options = {
            autoplay: true
        };

        let player = await this._clientLaunch(DefaultMediaReceiver);
        await this._playerLoad(player, media, options);
        await this._waitForPlayer(player);
    }

    setVolume(volume) {
        return new Promise((resolve, reject) => {
            this.client.setVolume({level: volume / 100}, (err, newVolume) => {
                if (err) {
                    return reject(err);
                }
                resolve(newVolume);
            });
        })
    }

    getVolume() {
        return new Promise((resolve, reject) => {
            this.client.getVolume((err, volume) => {
                if (err) {
                    return reject(err);
                }
                resolve(volume.level * 100);
            });
        })
    }

    connect() {
        return new Promise((resolve, _) => {
            this.client.connect(this.ip, () => {
                resolve();
            });
        })
    }

    disconnect() {
        this.client.close();
    }


    _clientLaunch(receiver) {
        return new Promise((resolve, reject) => {
            this.client.launch(receiver, (err, player) => {
                if (err) {
                    return reject(err);
                }
                resolve(player);
            });
        })
    }

    _playerLoad(player, media, options) {
        return new Promise((resolve, reject) => {
            player.load(media, options, (err, status) => {
                if (err) {
                    return reject(err);
                }
                resolve(status);
            });
        })
    }

    _waitForPlayer(player) {
        return new Promise((resolve, _) => {
            player.on('status', (status) => {
                if (status.playerState === "IDLE") {
                    resolve();
                }
            })
        });
    }

}

module.exports = GHome;