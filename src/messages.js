let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The key is not valid voting Key or you are connected to the wrong chain! Please make sure you have loaded correct voting key in Metamask'
messages.noMetamaskAccount = `Your MetaMask is locked.
Please choose your voting key in MetaMask and reload the page.
Check ARTIS <a href='https://github.com/lab10-coop/sigma1#use-with-metamask' target='blank'>wiki</a> for more info.`
messages.NO_METAMASK_MSG = `You haven't chosen any account in MetaMask.
Please, choose your voting key in MetaMask and reload the page.
Check ARTIS <a href='https://github.com/lab10-coop/sigma1#use-with-metamask' target='blank'>wiki</a> for more info.`
messages.WRONG_NETWORK_MSG = `You aren't connected to ARTIS. 
Please, switch on ARTIS plugin and refresh the page. 
Check ARTIS <a href='https://github.com/lab10-coop/sigma1#use-with-metamask' target='blank'>wiki</a> for more info.`

module.exports = {
  messages
}
