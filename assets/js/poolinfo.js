/**
 * Pool statistics
 **/
function getPoolMiningCore(poolID, poolURL){
   var apiURL = poolURL +  "/"  + poolID; 
   $.get(apiURL, function(data){
        if (!data) return ;

        var poolHashrate = 'N/A';
        var poolMiners   = 'N/A';
        var blocksFound   = 'N/A';
        var networkHashrate = 'N/A';
        var networkDiff = 'N/A';
        var networkBlockheight = 'N/A';
        var hasheffort = 'N/A';
        var hashPower = 'N/A';
        var poolBlockReward = 'N/A';
        var algorithm = "N/A"; 
        var poolId = poolID;
        
        
        if (data.pool) {
            poolHashrate = getReadableHashRate(data.pool.poolStats.poolHashrate);
            poolMiners   = data.pool.poolStats.connectedMiners;
            blocksFound  = data.pool.totalBlocks || 0;
            networkHashrate  = getReadableHashRate(data.pool.networkStats.networkHashrate);
            networkDiff = getReadableDiff(data.pool.networkStats.networkDifficulty);
            networkBlockheight = data.pool.networkStats.blockHeight;
            hasheffort = data.pool.poolEffort.toFixed(1) + " %";
            hashPower = (data.pool.poolStats.poolHashrate / data.pool.networkStats.networkHashrate) * 100;
            hashPower = hashPower.toFixed(2) + '%';
             if (poolId === 'btc') {
                poolBlockReward = 3.125
             } else if (poolId === 'bch'){
                poolBlockReward = 3.125
             } else if (poolId === 'ltc'){
                poolBlockReward = 6.250
             } else if (poolId === 'doge'){
                poolBlockReward = 10000
             } else if (poolId === 'soh'){
                poolBlockReward = 50
             } else if (poolId === 'fxtc'){
                poolBlockReward = 0.00089
             } else if (poolId === 'lcc'){
                poolBlockReward = 7.8125
             } else if (poolId === 'fix'){
                poolBlockReward = 0.06255323
             } else if (poolId === 'maza'){
                poolBlockReward = 62.50
             } else if (poolId === 'dgc'){
                poolBlockReward = 1.25
             } else {
                poolBlockReward = 0
             }; 
            algorithm = data.pool.coin.algorithm
        }

        updateText(poolID + '_poolHashrate', poolHashrate);
        updateText(poolID + '_poolMiners', poolMiners);
	    updateText(poolID + '_blocksFound', blocksFound);
        updateText(poolID + '_networkHashrate', networkHashrate);
        updateText(poolID + '_networkDiff', networkDiff);
        updateText(poolID + '_networkBlockheight', networkBlockheight);
        updateText(poolID + '_hasheffort', hasheffort);
        updateText(poolID + '_hashPower', hashPower)
        updateText(poolID + '_poolBlockReward', poolBlockReward);
        updateText(poolID + '_algorithm', algorithm);
        updateText(poolID + '_poolBlockReward_replicate', poolBlockReward);
        updateText(poolID + '_algorithm_replicate', algorithm);
    });
}

function getPoolStats(poolID, poolURL) {
    var apiURL = poolURL + '/stats';
    $.get(apiURL, function(data){
        if (!data) return ;

        var poolHashrate = 'N/A';
        var poolMiners   = 'N/A';
        var poolMinersSolo   = 'N/A';
        var poolWorkers  = 'N/A';
        var poolWorkersSolo = 'N/A';
        if (data.pool) {
            poolHashrate = getReadableHashRate(data.pool.hashrate);
            poolMiners   = data.pool.miners || 0;
            poolMinersSolo   = data.pool.miners || 0;
            poolWorkers  = data.pool.workers || 0;
            poolWorkersSolo  = data.pool.workersSolo || 0;
        }

        var poolBlockReward = 'N/A';
        if (data.lastblock) {
            poolBlockReward = (data.lastblock.reward / data.config.denominationUnit).toFixed(3)|| 0;

        }

        var networkHashrate = 'N/A';
        var networkDiff     = 'N/A';
        if (data.network) {
            networkHashrate = getReadableHashRate(data.network.difficulty / data.config.coinDifficultyTarget);
            networkDiff     = data.network.difficulty;
        }

        var hashPower = 'N/A';
        var poolDifficulty = 'N/A';
        var poolBlockheight = 'N/A';
        var hasheffort = 'N/A';

        if (data.pool && data.network) {
            hashPower = data.pool.hashrate / (data.network.difficulty / data.config.coinDifficultyTarget) * 100;
            hashPower = hashPower.toFixed(2) + '%';
            poolDifficulty = getReadableDiff(data.network.difficulty);
            poolBlockheight = data.network.height;
            hasheffort = (data.pool.roundHashes / data.network.difficulty * 100).toFixed(1) + ' %';
        }

        var blocksFound = data.pool?.totalBlocks ?? 0;

        var cnAlgorithm = data.config?.cnAlgorithm ?? "cryptonight";
        var cnVariant = data.config?.cnVariant ?? 0;

       if (cnAlgorithm == "cryptonight_pico") {
            algorithm = 'CN Turtle';
        }
        else if (cnAlgorithm == "cryptonight_heavy") {
            algorithm = 'CN Heavy';
        }
        else if (cnAlgorithm == "cryptonight_plex") {
            algorithm = 'CN UPX V2';
        }
        else if (cnAlgorithm == "argon2") {
            algorithm = 'Chukwa';
        }
        else if (cnAlgorithm == "randomx") {
            if (cnVariant === 2) {
                algorithm = 'Random/ARQ';
            } else {
                algorithm = 'RandomX';
            }
        }
        else if (cnAlgorithm == "ethash") {
            if (cnVariant === 2) {
                algorithm = 'ProgPowZ';
            } 
        }
        else {
            if (cnVariant === 11) {
                algorithm = 'CN Conceal';
            } else {
                algorithm = 'Cryptonight';
            }
        }

        updateText(poolID + '_poolHashrate', poolHashrate);
        updateText(poolID + '_poolMiners', poolMiners);
        updateText(poolID + '_poolMinersSolo', poolMinersSolo);
        updateText(poolID + '_poolWorkers', poolWorkers);
        updateText(poolID + '_poolWorkersSolo', poolWorkersSolo);
        updateText(poolID + '_networkHashrate', networkHashrate);
        updateText(poolID + '_hashPower', hashPower);
        updateText(poolID + '_poolDifficulty', poolDifficulty);
        updateText(poolID + '_poolBlockheight', poolBlockheight);
        updateText(poolID + '_hasheffort', hasheffort);
        updateText(poolID + '_blocksFound', blocksFound);
        updateText(poolID + '_poolBlockReward', poolBlockReward);
        updateText(poolID + '_poolBlockReward_replicate', poolBlockReward);
        updateText(poolID + '_algorithm', algorithm);
        updateText(poolID + '_algorithm_replicate', algorithm);
    });
}

// Update pools
function updatePools() {
    getPoolStats('conceal', 'https://superblockchain.zapto.org/api/ccx'); // Server 1
    getPoolStats('kryptokrona', 'https://superblockchain.zapto.org/api/xkr'); // Server 2
    getPoolStats('bitcoinnova', 'https://superblockchain.zapto.org/api/btnc'); // Server 2
    getPoolStats('infinium', 'https://superblockchain.zapto.org/api/inf'); // Server 2
    getPoolStats('zano', 'https://superblockchain.zapto.org/api/zano'); // Server 2
    getPoolStats('zentcash', 'https://superblockchain.zapto.org/api/ztc'); // Server 2
    getPoolStats('evox', 'https://superblockchain.zapto.org/api/evox'); // Server 2
    getPoolStats('nirmata', 'https://superblockchain.zapto.org/api/nir'); // Server 2
    getPoolStats('wrkzcoin', 'https://superblockchain.zapto.org/api/wrkz'); // Server 2
    getPoolStats('monero', 'https://superblockchain.zapto.org/api/xmr'); // Server 3   
    getPoolStats('zephyr', 'https://superblockchain.zapto.org/api/zeph'); // Server 3
    getPoolStats('morelo', 'https://superblockchain.zapto.org/api/mrl'); // Server 3
    getPoolStats('gntlcoin', 'https://superblockchain.zapto.org//api/gntl'); // Server 3
    getPoolMiningCore('btc', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('bch', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('bchII', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('ltc', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('doge', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('soh', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('fxtc', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('fix', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('lcc', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('dgc', 'https://superblockchain.zapto.org/miningcore/api/pools');
    getPoolMiningCore('maza', 'https://superblockchain.zapto.org/miningcore/api/pools');

}

// Initialize
$(function() {
    setInterval(updatePools, (30*1000));
    updatePools();
});

/**
 * Strings
 **/

// Update Text content
function updateText(elementId, text){
    var el = document.getElementById(elementId);
    if (el && el.textContent !== text){
        el.textContent = text;
    }
    return el;
}

// Get readable hashrate
function getReadableHashRate(hashrate){
    var i = 0;
    var byteUnits = [' H',' KH',' MH',' GH',' TH',' PH',' EH',' ZH',' YH',' RH',' QH',' WH',' VH',' UH',' SH',' NH',' DH',' HH'];
    while (hashrate > 1000){
        hashrate = hashrate / 1000;
        i++;
    }
    return hashrate.toFixed(2) + byteUnits[i] + '/s';
}

function getReadableDiff(Diff){
    var i = 0;
    var byteUnits = [' ',' K',' M',' G',' T',' P',' E',' Z',' Y',' R',' Q',' W',' V',' U',' S',' N',' D',' H'];
    while (Diff > 1000){
        Diff = Diff / 1000;
        i++;
    }
    return Diff.toFixed(2) + byteUnits[i];
}
