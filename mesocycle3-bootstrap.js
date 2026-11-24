// Runs before any database reads. Roll back only an interrupted multi-key import.
try {
    const pending = localStorage.getItem("ft_m3_importJournal");
    if (pending) {
        const before = JSON.parse(pending);
        Object.entries(before).forEach(([key, value]) => {
            if (!key.startsWith("ft_")) throw new Error("Invalid recovery key");
            if (value === null) localStorage.removeItem(key);
            else localStorage.setItem(key, value);
        });
        localStorage.removeItem("ft_m3_importJournal");
    }
} catch (error) {
    console.error("Import recovery failed", error);
    window.m3RecoveryFailed = true;
}
