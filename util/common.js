const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();

    for (const iface of Object.values(interfaces)) {
        for (const net of iface) {
        if (
            net.family === 'IPv4' &&
            !net.internal &&
            isPrivateIP(net.address)
        ) {
            return net.address;
        }
        }
    }

    return null;
}

function isPrivateIP(ip) {
    return (
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        (ip.startsWith('172.') &&
        (() => {
            const second = Number(ip.split('.')[1]);
            return second >= 16 && second <= 31;
        })())
    );
}

module.exports = {
  getLocalIP
};