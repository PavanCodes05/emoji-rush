export const checkCollision = (player, obstacle) => {
    // Make hitbox 20% smaller than the visual size for fairness
    const buffer = obstacle.width * 0.2; 
    
    return (
        player.x < obstacle.x + obstacle.width - buffer &&
        player.x + player.width > obstacle.x + buffer &&
        player.y < obstacle.y + obstacle.height - buffer &&
        player.y + player.height > obstacle.y + buffer
    );
};