/**
 * Roll handler - Contains the logic for the roll system
 * Handles probability distribution and reward generation
 */

// Define the reward probabilities and ranges
const REWARDS = {
  OWO: {
    probability: 0.75, // 75%
    minAmount: 100000, // 100k
    maxAmount: 300000, // 300k
    label: 'Owo currency'
  },
  NITRO: {
    probability: 0.20, // 20%
    links: [
      'https://discord.com/billing/promotions/nitro',
      'https://discord.com/promotions/nitro/classic',
      'https://discord.com/nitro'
    ],
    label: 'Nitro promo link'
  },
  INR: {
    probability: 0.05, // 5%
    minAmount: 10,
    maxAmount: 50,
    label: 'INR reward'
  }
};

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects a random Nitro promo link
 * @returns {string} A random Nitro promo link
 */
function getRandomNitroLink() {
  const randomIndex = Math.floor(Math.random() * REWARDS.NITRO.links.length);
  return REWARDS.NITRO.links[randomIndex];
}

/**
 * Performs a random roll based on the configured probabilities
 * @returns {object} An object containing the roll result information
 */
function performRoll() {
  const randomValue = Math.random();
  
  // Determine which reward category was rolled
  if (randomValue < REWARDS.OWO.probability) {
    // 50% chance: OWO currency
    const amount = getRandomNumber(REWARDS.OWO.minAmount, REWARDS.OWO.maxAmount);
    return {
      type: 'OWO',
      amount: amount,
      message: `🎉 You rolled **${REWARDS.OWO.label}** and won **${amount.toLocaleString()} Owo**!`
    };
  } else if (randomValue < REWARDS.OWO.probability + REWARDS.NITRO.probability) {
    // 20% chance: Nitro promo link
    const link = getRandomNitroLink();
    return {
      type: 'NITRO',
      link: link,
      message: `🎉 You rolled **${REWARDS.NITRO.label}**!\nYou won one promo link!`
    };
  } else {
    // 5% chance: INR reward
    const amount = getRandomNumber(REWARDS.INR.minAmount, REWARDS.INR.maxAmount);
    return {
      type: 'INR',
      amount: amount,
      message: `🎉 You rolled **${REWARDS.INR.label}** and won **${amount} INR**!`
    };
  }
}

module.exports = {
  performRoll
};
