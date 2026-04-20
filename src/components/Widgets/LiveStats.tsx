import React, { useEffect, useState } from 'react';
import { Github, Code, ExternalLink, Activity, Star, GitFork, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveStats = () => {
    const [githubData, setGithubData] = useState<any>(null);
    const [leetcodeData, setLeetcodeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const GITHUB_USERNAME = 'zeenutt769';
    const LEETCODE_USERNAME = 'zeenutt769'; // Defaulting to the same username

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch GitHub Stats
                const ghRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
                const ghJson = await ghRes.json();
                
                // Fetch GitHub Repos for stars
                const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
                const reposJson = await reposRes.json();
                const totalStars = Array.isArray(reposJson) ? reposJson.reduce((acc, repo) => acc + repo.stargazers_count, 0) : 0;
                
                setGithubData({ ...ghJson, totalStars });

                // Fetch LeetCode Stats (Using third party proxy API)
                const lcRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
                const lcJson = await lcRes.json();
                setLeetcodeData(lcJson);

            } catch (err) {
                console.error("Failed to fetch live stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-[var(--text-secondary)]">
                <Activity className="animate-pulse mr-2" size={16} />
                <span className="font-mono text-sm">Fetching live telemetry...</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* GITHUB STATS */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)] transition-colors group"
            >
                <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
                    <div className="flex items-center gap-3">
                        <Github className="text-[var(--text-primary)]" size={24} />
                        <h3 className="font-bold text-[var(--text-primary)]">GitHub Live</h3>
                    </div>
                    {githubData?.html_url && (
                        <a href={githubData.html_url} target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">
                            <ExternalLink size={16} />
                        </a>
                    )}
                </div>
                
                {githubData ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-[var(--text-secondary)] text-xs font-mono mb-1">Followers</span>
                            <span className="text-xl font-bold text-[var(--accent)]">{githubData.followers || 0}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[var(--text-secondary)] text-xs font-mono mb-1">Public Repos</span>
                            <span className="text-xl font-bold text-[var(--accent)]">{githubData.public_repos || 0}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[var(--text-secondary)] text-xs font-mono mb-1">Total Stars</span>
                            <div className="flex items-center gap-1 text-xl font-bold text-[var(--warning)]">
                                <Star size={16} fill="currentColor" />
                                <span>{githubData.totalStars || 0}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[var(--text-secondary)] text-xs font-mono mb-1">Gists</span>
                            <span className="text-xl font-bold text-[var(--info)]">{githubData.public_gists || 0}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-[var(--text-secondary)] text-sm">Failed to load GitHub data.</div>
                )}
            </motion.div>

            {/* LEETCODE STATS */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-5 hover:border-[#ffa116] transition-colors group"
            >
                <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
                    <div className="flex items-center gap-3">
                        <Code className="text-[#ffa116]" size={24} />
                        <h3 className="font-bold text-[var(--text-primary)]">LeetCode Live</h3>
                    </div>
                    <a href={`https://leetcode.com/${LEETCODE_USERNAME}`} target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-[#ffa116]">
                        <ExternalLink size={16} />
                    </a>
                </div>

                {leetcodeData && leetcodeData.status !== "error" ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[var(--text-secondary)] text-xs font-mono mb-1">Total Solved</span>
                                <span className="text-3xl font-bold text-[var(--text-primary)]">
                                    {leetcodeData.totalSolved} <span className="text-sm font-normal text-[var(--text-secondary)]">/ {leetcodeData.totalQuestions}</span>
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[var(--text-secondary)] text-xs font-mono mb-1">Ranking</span>
                                <div className="flex items-center gap-1 text-lg font-bold text-[var(--accent)]">
                                    <Award size={16} />
                                    <span>{leetcodeData.ranking?.toLocaleString() || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden flex">
                            <div style={{ width: `${(leetcodeData.easySolved / leetcodeData.totalSolved) * 100}%` }} className="h-full bg-[#00b8a3]"></div>
                            <div style={{ width: `${(leetcodeData.mediumSolved / leetcodeData.totalSolved) * 100}%` }} className="h-full bg-[#ffc01e]"></div>
                            <div style={{ width: `${(leetcodeData.hardSolved / leetcodeData.totalSolved) * 100}%` }} className="h-full bg-[#ff375f]"></div>
                        </div>

                        <div className="flex justify-between text-xs font-mono mt-1">
                            <span className="text-[#00b8a3]">Easy: {leetcodeData.easySolved}</span>
                            <span className="text-[#ffc01e]">Medium: {leetcodeData.mediumSolved}</span>
                            <span className="text-[#ff375f]">Hard: {leetcodeData.hardSolved}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-[var(--text-secondary)] text-sm">Waiting for LeetCode profile setup or API unavailable.</div>
                )}
            </motion.div>
        </div>
    );
};
